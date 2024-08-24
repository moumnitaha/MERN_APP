import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import createApiInstance from "../../interceptors/interceptor.js";
import { useNavigate } from "react-router-dom";

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

  return (
    <section className="flex flex-col items-center justify-center w-svw h-svh">
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 w-[calc(50svw)]"
      >
        <label className="text-lg font-semibold px-2">Title</label>
        <input
          name="title"
          type="text"
          className="p-2 m-6 border-2 border-gray-300 rounded-lg"
          value={formData.title}
          onChange={handleChange}
        />
        <label className="text-lg font-semibold px-2">Description</label>
        <textarea
          name="description"
          type="text-area"
          className="p-2 m-6 border-2 border-gray-300 rounded-lg min-h-32"
          value={formData.description}
          onChange={handleChange}
        />
        <label className="text-lg font-semibold px-2">Price</label>
        <input
          name="price"
          type="number"
          className="p-2 m-6 border-2 border-gray-300 rounded-lg"
          value={formData.price}
          onChange={handleChange}
        />
        <label className="text-lg font-semibold px-2">Category</label>
        <input
          name="category"
          type="text"
          className="p-2 m-6 border-2 border-gray-300 rounded-lg"
          value={formData.category}
          onChange={handleChange}
        />
        <label className="text-lg font-semibold px-2">Images</label>
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
