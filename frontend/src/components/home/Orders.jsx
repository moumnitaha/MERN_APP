import React, { useState, useEffect } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/20/solid";
import createApiInstance from "../../interceptors/interceptor";
import { Link } from "react-router-dom";

const api = createApiInstance();

function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await api.get("/orders");
        console.log(response.data[7]);
        setOrders(response.data);
      } catch (error) {
        console.error(error?.response?.data);
      }
    };
    getOrders();
  }, []);
  return (
    <section className="w-full h-screen flex flex-col items-start justify-start bg-[#f9f9f9] text-gray-950 pl-60">
      <span className="text-2xl font-bold text-gray-800 m-4 font-poppins">
        <ClipboardDocumentListIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
        Orders
      </span>
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-4 text-left">Order ID</th>
            <th className="p-4 text-left">Products</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="p-4">{order._id}</td>
              <td className="p-4">
                {order.products.map((product) => (
                  <React.Fragment key={product._id}>
                    <span className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-8 w-8 inline-block mr-4"
                        />
                      </Link>
                      {"\u00D7"}
                      {product.quantity}
                    </span>
                  </React.Fragment>
                ))}
              </td>
              <td className="p-4">{order.quantity}</td>
              <td className="p-4">{order.total}</td>
              <th className="p-4">{order.user}</th>
              <td className="p-4">{order.status}</td>
              <td className="p-4">{order.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Orders;
