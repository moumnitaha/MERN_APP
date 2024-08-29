import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import createApiInstance from "../../interceptors/interceptor";
import { toast, ToastContainer } from "react-toastify";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";

const api = createApiInstance();

function Product() {
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newproduct = {
      _id: formData._id,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      rates: formData.rates,
      images: formData.images,
      category: {
        id: 0,
        name: formData.category,
      },
    };
    try {
      console.log(newproduct);
      const response = await api.put("/updateProduct", { product: newproduct });
      if (response.status === 200) {
        console.log("Product updated successfully");
        toast.success("Product updated successfully");
        console.log(response.data);
        setProduct(response.data.product);
        setShowModal(false);
      } else {
        console.error("Error updating product");
        toast.error("Error updating product");
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const deleteProduct = async (index) => {
    try {
      console.log("==>", product._id);
      const newProduct = {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        quantity: product.quantity,
        rates: product.rates,
        category: {
          id: product.category.id,
          name: product.category.name,
        },
      };
      const response = await api.delete("/deleteProduct", {
        data: { product: newProduct, image: index },
      });
      if (response.status === 200) {
        setShowDeleteModal(false);
        if (response?.data?.message === "Image deleted successfully") {
          setImg(null);
          //   setEnabled(false);
          setProduct({
            ...product,
            images: product.images.filter((img, i) => i !== index),
          });
          console.log("Image deleted successfully");
          toast.success("Image deleted successfully");
          return;
        }
        console.log("Product deleted successfully");
        toast.success("Product deleted successfully");
        console.log(response.data);
        setEnabled(false);
        setImg(null);
        setTimeout(() => {
          navigate("/products");
        }, 1000);
      } else {
        console.error("Error deleting product");
        toast.error("Error deleting product");
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const newProduct = {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        rates: product.rates,
        images: [...product.images, e.target.result],
        category: {
          id: product.category.id,
          name: product.category.name,
          image: product.category.image,
        },
      };
      try {
        console.log(newProduct);
        const response = await api.put("/updateProduct", {
          product: newProduct,
        });
        if (response.status === 200) {
          toast.success("Product updated successfully");
          setProduct(response.data.product);
        } else {
          toast.error("Error updating product");
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };
  };

  const params = useParams();
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    rates: 0,
    images: [],
    category: {
      id: 0,
      name: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [img, setImg] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [product, setProduct] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    createdAt: "",
    updatedAt: "",
    images: [],
    quantity: 0,
    rates: 0,
    category: {
      id: 0,
      name: "",
      image: "",
      createdAt: "",
      updatedAt: "",
    },
  });
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/products/?id=${params.id}`);
        if (response.status === 200) {
          console.log("Product retrieved successfully");
          console.log(response.data);
          setProduct(response.data);
        } else {
          console.error("Error retrieving product");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setProduct({
          _id: "",
          title: "",
          description: "",
          price: 0,
          createdAt: "",
          updatedAt: "",
          images: [],
          quantity: 0,
          rates: 0,
          category: {
            id: 0,
            name: "",
            image: "",
            createdAt: "",
            updatedAt: "",
          },
        });
      }
    };
    getProduct();
  }, [params.id]);
  return (
    <section className="w-full h-screen flex flex-col items-start justify-start bg-[#f9f9f9] text-gray-950 pl-60">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <span className="text-2xl font-bold text-gray-800 m-4">
        <Cog6ToothIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
        Edit Product
      </span>
      {product._id && !loading ? (
        <div className="flex flex-col items-start p-6 bg-[#f9f9f9] rounded-lg  w-3/4 m-5 font-poppins border border-gray-200">
          <div className="flex-shrink-0 mb-6 flex-row flex w-full overflow-auto">
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div
                  className="min-w-64 h-64 aspect-square m-1 relative p-4"
                  key={index}
                >
                  <button
                    className="absolute left-0 top-0 bg-red-500 w-8 h-8 rounded-full font-extrabold text-white flex justify-center items-center cursor-pointer text-2xl"
                    onClick={() => {
                      setImg(index);
                      setShowDeleteModal(true);
                    }}
                  >
                    <span className="m-auto">×</span>
                  </button>
                  <img
                    key={index}
                    className={`w-full h-full aspect-square object-contain rounded-md bg-stone-200 cursor-pointer ${
                      img === index ? "border-2 border-red-600 blur-sm" : ""
                    }`}
                    src={image}
                    alt={product.title}
                    onClick={() => window.open(image, "_blank")}
                  />
                </div>
              ))
            ) : (
              <img
                className="w-64 h-64 object-cover m-1"
                src="https://via.placeholder.com/300"
                alt={product.title}
              />
            )}
            {product.images.length < 4 ? (
              <>
                <label
                  htmlFor="upload"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer min-w-56 h-56 aspect-square m-5 relative p-5 border-2 border-dashed border-gray-300 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 fill-white stroke-blue-500"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-gray-600 font-medium">
                    Upload image
                  </span>
                </label>
                <input
                  id="upload"
                  name="images"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleImage}
                />
              </>
            ) : null}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl text-bold mb-4">{product.title}</h2>
            <p className="text-gray-700 text-lg mb-4 break-all w-full">
              {product.description}
            </p>
            <p className="text-xl font-semibold mb-4">
              Price: {product.price}
              {"$"}
            </p>
            <p className="text-lg font-semibold mb-4">
              Quantity: {product.quantity}
            </p>
            <p className="text-lg font-semibold">Rates: {product.rates}</p>
            <div className="flex flex-row items-center">
              <p className="text-lg font-semibold mr-4">
                Category: {product.category.name}
              </p>
              <img
                src={product.category.image}
                className="w-20 h-20 rounded-full border-4 border-slate-200 shadow-lg"
                alt={product.category.name}
              />
            </div>
            <p className="text-sm mb-2">
              Created At: {new Date(product.createdAt).toLocaleString("FR-fr")}
            </p>
            <p className="text-sm mb-2">
              Updated At: {new Date(product.updatedAt).toLocaleString("FR-fr")}
            </p>
            {/* <p className="text-sm mb-2">
                Category Created At:{" "}
                {new Date(product.category.createdAt).toLocaleString("FR-fr")}
              </p>
              <p className="text-sm">
                Category Updated At:{" "}
                {new Date(product.category.updatedAt).toLocaleString("FR-fr")}
              </p> */}
          </div>
          <div className="flex flex-row items-center justify-end w-full mt-6">
            <button
              disabled={!enabled}
              className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={() => {
                setShowModal(true);
                setFormData({
                  _id: product._id,
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  rates: product.rates,
                  quantity: product.quantity,
                  category: product.category.name,
                  images: product.images,
                });
              }}
            >
              Edit Product
            </button>
            <button
              disabled={!enabled}
              className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 text-center ml-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Product
            </button>
          </div>
          {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-6 mx-auto w-svw">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-fit bg-white outline-none focus:outline-none text-black m-auto">
                    {/*header*/}
                    <label className="text-3xl font-semibold text-center p-6">
                      Edit Product
                    </label>
                    {/*body*/}
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col p-6 w-[calc(50svw)]"
                    >
                      <label className="text-lg font-semibold px-2">
                        Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        type="text-area"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg min-h-20"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Price
                      </label>
                      <input
                        name="price"
                        type="number"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Rates
                      </label>
                      <input
                        name="rates"
                        type="number"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.rates}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Quantity
                      </label>
                      <input
                        name="quantity"
                        type="number"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Category
                      </label>
                      <input
                        name="category"
                        type="text"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.category}
                        onChange={handleChange}
                      />
                      {/* <label className="text-lg font-semibold px-2">
                        Add Images
                      </label>
                      <input
                        name="images"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        onChange={handleImage}
                      /> */}
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <button
                          className="bg-blue-500 text-white active:bg-blue-700 hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit"
                          //   onClick={() => setShowModal(false)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
          {showDeleteModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-6 mx-auto w-svw">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-fit bg-white outline-none focus:outline-none text-black m-auto">
                    {/*header*/}
                    <label className="text-3xl font-semibold text-center p-6">
                      Delete {img ? "Image" : "Product"}
                    </label>
                    {/*body*/}
                    <div className="flex flex-col p-6 w-[calc(50svw)]">
                      <label className="text-lg font-light px-2">
                        Are you sure you want to delete this{" "}
                        {img ? "Image" : "product"}?
                      </label>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setShowDeleteModal(false);
                            setImg(null);
                          }}
                        >
                          Close
                        </button>
                        <button
                          disabled={!enabled}
                          className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 text-center ml-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
                          type="button"
                          onClick={() => deleteProduct(img)}
                        >
                          Delete {img ? "Image" : "Product"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <p>Product not found</p>
      )}
    </section>
  );
}

export default Product;
