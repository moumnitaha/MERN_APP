import React, { useState, useEffect, useContext } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import createApiInstance from "../../interceptors/interceptor";
import { AuthContext } from "../../lib/AuthProvider";

const api = createApiInstance();

function AddOrder() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    products: [],
    total: 0,
    status: "Pending",
    user: user._id,
  });

  console.log("order=> ", order);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/addOrder", order);
      if (response.status === 201) {
        console.log("Order created successfully");
      } else {
        console.error("Error creating order");
      }
    } catch (error) {
      console.error(error?.response?.data);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error?.response?.data);
      }
    };
    getProducts();
  }, []);

  return (
    <section className="w-full h-screen flex flex-col items-start justify-start bg-[#f9f9f9] text-gray-950 pl-60">
      <span className="text-2xl font-bold text-gray-800 m-4 font-poppins">
        <PlusIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
        Add Order
      </span>
      <form
        className="w-full flex flex-col items-start justify-start"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="products"
          className="text-lg font-medium text-gray-800 m-4 font-poppins"
        >
          Products
        </label>
        <select
          name="products"
          id="products"
          className="w-96 p-2 m-4 border border-gray-300 rounded-md"
          onChange={(e) =>
            setOrder({
              ...order,
              products: [
                {
                  product: e.target.value,
                  quantity: 1,
                },
              ],
            })
          }
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.title}
              {" : "}
              {product.price}$
            </option>
          ))}
        </select>
        <label
          htmlFor="quantity"
          className="text-lg font-medium text-gray-800 m-4 font-poppins"
        >
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          className="w-96 p-2 m-4 border border-gray-300 rounded-md"
          onChange={(e) =>
            setOrder({
              ...order,
              products: [
                {
                  product: order.products[0].product,
                  quantity: e.target.value * 1,
                },
              ],
              total:
                products.find(
                  (product) => product._id === order.products[0].product
                ).price * e.target.value,
            })
          }
        />
        <button
          type="submit"
          className="w-48 p-3 m-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ADD ORDER
        </button>
      </form>
    </section>
  );
}

export default AddOrder;
