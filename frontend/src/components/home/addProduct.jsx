import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import createApiInstance from "../../interceptors/interceptor.js";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const api = createApiInstance();

function addProduct() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    images: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newproduct = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        images: [formData.images],
        category: {
          name: formData.category,
        },
      };
      console.log(newproduct);
      const response = await api.post("/addProduct", { product: newproduct });
      if (response.status === 200) {
        console.log("Product add successfully");
        toast.success("Product add successfully");
        console.log(response.data);
        setEnabled(false);
        setTimeout(() => {
          navigate(`/product/${response.data.id}`);
        }, 2000);
        // setProduct(response.data.product);
      } else {
        toast.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error(error.response.data.error);
    }
    // setShowModal(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!file) return;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, images: reader.result });
    };
  };

  return (
    <section className="flex flex-col items-start justify-center max-w-svw min-h-svh h-fit pl-60">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <span className="text-2xl font-bold text-gray-800 m-4">
        <PlusCircleIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
        Add Product
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 w-[calc(50svw)]"
      >
        <label className="text-lg font-semibold px-2">Title</label>
        <input
          name="title"
          type="text"
          className="p-2 m-2 border-2 border-gray-300 rounded-lg"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Black hoodie with stripes"
        />
        <label className="text-lg font-semibold px-2">Description</label>
        <textarea
          name="description"
          type="text-area"
          className="p-2 border-2 border-gray-300 ml-2 mt-2 rounded-lg min-h-32"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description must be between 100 and 500 characters"
        />
        <p className="text-red-500 text-sm mb-2 ml-2">
          {formData.description.length &&
          (formData.description.length < 100 ||
            formData.description.length > 500)
            ? "Description must be between 100 and 500 characters"
            : " "}
        </p>
        <label className="text-lg font-semibold px-2">Price</label>
        <input
          name="price"
          type="number"
          min={0}
          max={100_000}
          className="p-2 m-2 border-2 border-gray-300 rounded-lg"
          value={formData.price}
          onChange={handleChange}
        />
        <label className="text-lg font-semibold px-2">Category</label>
        <input
          name="category"
          type="text"
          className="p-2 m-2 border-2 border-gray-300 rounded-lg"
          value={formData.category}
          onChange={handleChange}
          placeholder="Valid categories: Clothes - Electronics - Furniture - Shoes - Miscellaneous"
        />
        <label className="text-lg font-semibold px-2">Images</label>
        {/* <input
          name="images"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="p-2 m-6 border-2 border-gray-300 rounded-lg"
          onChange={handleImage}
        /> */}
        <label
          htmlFor="upload"
          className="flex flex-col items-center justify-center gap-2 cursor-pointer w-56 h-56 aspect-square m-2 relative p-5 border-2 border-dashed border-gray-300 rounded-md"
        >
          {formData.images ? (
            <img
              src={formData.images}
              alt="product"
              className="w-48 h-48 rounded-lg object-conatin aspect-square"
            />
          ) : (
            <>
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
              <span className="text-gray-600 font-medium">Upload image</span>
            </>
          )}
        </label>
        <input
          id="upload"
          name="images"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={handleImage}
          onAbort={() => console.log("aborted")}
        />
        {/*footer*/}
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button
            disabled={!enabled}
            className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            type="submit"
            //   onClick={() => setShowModal(false)}
          >
            ADD PRODUCT
          </button>
        </div>
      </form>
    </section>
  );
}

export default addProduct;
