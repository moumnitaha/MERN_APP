import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import createApiInstance from "../../interceptors/interceptor";
import { toast, ToastContainer } from "react-toastify";

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
      images: [...new Set([formData.images, ...product.images])],
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

  const deleteProduct = async () => {
    try {
      console.log("==>", product._id);
      const newProduct = {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        category: {
          id: product.category.id,
          name: product.category.name,
        },
      };
      const response = await api.delete("/deleteProduct", {
        data: { product: newProduct },
      });
      if (response.status === 200) {
        console.log("Product deleted successfully");
        toast.success("Product deleted successfully");
        console.log(response.data);
        setEnabled(false);
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

  const params = useParams();
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    images: "",
    category: {
      id: 0,
      name: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [product, setProduct] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    createdAt: "",
    updatedAt: "",
    images: [],
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
    <section className="w-full h-screen flex flex-col items-start justify-start bg-[#f9f9f9] text-gray-950 p-8 pl-60">
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
      {product._id && !loading ? (
        <div className="flex flex-col items-start p-6 bg-[#fff] rounded-lg shadow-lg w-3/4 m-5">
          <div className="flex-shrink-0 mb-6 flex-row flex w-full">
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <img
                  key={index}
                  className="w-64 h-64 object-cover"
                  src={image}
                  alt={product.title}
                />
              ))
            ) : (
              <img
                className="w-64 h-64 object-cover m-1"
                src="https://via.placeholder.com/300"
                alt={product.title}
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl text-bold mb-4">{product.title}</h2>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-4">
              {product.price}
              {"$"}
            </p>
            <div className="mt-4">
              <p className="text-sm mb-2">
                Created At:{" "}
                {new Date(product.createdAt).toLocaleString("FR-fr")}
              </p>
              <p className="text-sm mb-2">
                Updated At:{" "}
                {new Date(product.updatedAt).toLocaleString("FR-fr")}
              </p>
              <p className="text-sm mb-2">Category: {product.category.name}</p>
              <p className="text-sm mb-2">
                Category Created At:{" "}
                {new Date(product.category.createdAt).toLocaleString("FR-fr")}
              </p>
              <p className="text-sm">
                Category Updated At:{" "}
                {new Date(product.category.updatedAt).toLocaleString("FR-fr")}
              </p>
            </div>
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
                  category: product.category.name,
                  images: product.images[0],
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
                        Category
                      </label>
                      <input
                        name="category"
                        type="text"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.category}
                        onChange={handleChange}
                      />
                      <label className="text-lg font-semibold px-2">
                        Images
                      </label>
                      <input
                        name="images"
                        type="text"
                        className="p-2 m-6 border-2 border-gray-300 rounded-lg"
                        value={formData.images}
                        onChange={handleChange}
                      />
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
                      Delete Product
                    </label>
                    {/*body*/}
                    <div className="flex flex-col p-6 w-[calc(50svw)]">
                      <label className="text-lg font-light px-2">
                        Are you sure you want to delete this product?
                      </label>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          Close
                        </button>
                        <button
                          disabled={!enabled}
                          className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 text-center ml-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
                          type="button"
                          onClick={deleteProduct}
                        >
                          Delete Product
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
