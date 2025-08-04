import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import createApiInstance from "../../interceptors/interceptor";
import { toast } from "react-toastify";

const api = createApiInstance();

function AddOrder() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product: "",
    quantity: 1,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [customer, setCustomer] = useState("");

  console.log(form);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let order = {
        customer: customer,
        products: selectedProducts,
        status: "pending",
        total: total,
      };
      const response = await api.post("/addOrder", order);
      if (response.status === 201) {
        console.log("Order created successfully");
        toast.success("Order created successfully");
        setSelectedProducts([]);
      } else {
        console.error("Error creating order");
        toast.error("Error creating order");
      }
    } catch (error) {
      console.error(error?.response?.data);
      toast.error(error?.response?.data?.message);
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
    const getUsers = async () => {
      try {
        const response = await api.get("/users?me=true");
        setUsers(response.data);
      } catch (error) {
        console.error(error?.response?.data);
      }
    };
    getUsers();
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
          htmlFor="customer"
          className="text-lg font-medium text-gray-800 m-4 font-poppins"
        >
          Customer
        </label>
        <select
          disabled={customer ? true : false}
          name="users"
          id="users"
          className="w-96 p-2 m-4 border border-gray-300 rounded-md"
          onChange={(e) => setCustomer(e.target.value)}
        >
          <option value="">Select a customer</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        <label
          htmlFor="product"
          className="text-lg font-medium text-gray-800 m-4 font-poppins"
        >
          Products
        </label>
        <select
          name="product"
          id="product"
          className="w-96 p-2 m-4 border border-gray-300 rounded-md"
          onChange={handleChange}
          value={form.product}
          disabled={customer ? false : true}
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
          min={"1"}
          value={form.quantity}
          className="w-96 p-2 m-4 border border-gray-300 rounded-md disabled:text-gray-500"
          onChange={handleChange}
          disabled={customer ? false : true}
        />
        <button
          type="button"
          disabled={form.product === ""}
          onClick={() => {
            let prevProduct = selectedProducts.find(
              (p) => p.product === form.product
            );
            if (prevProduct) {
              prevProduct.quantity =
                parseInt(prevProduct.quantity) + parseInt(form.quantity);
              setSelectedProducts([...selectedProducts]);
              setForm({
                product: "",
                quantity: 1,
              });
              return;
            }
            setSelectedProducts([...selectedProducts, form]);
            setTotal(
              total +
                products.find((p) => p._id === form.product).price *
                  form.quantity
            );
            setForm({
              product: "",
              quantity: 1,
            });
          }}
          className="min-w-48 p-3 m-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ADD PRODUCTS TO THE ORDER
        </button>
        <h1 className="m-4">Orders:</h1>
        <div className="w-[calc(100svw-17rem)] bg-gray-100 flex flex-row flex-wrap gap-1 p-4 m-4 border border-dashed border-gray-400 rounded-md">
          {selectedProducts.length > 0 &&
            selectedProducts.map((product, index) => (
              <div key={index}>
                <span className="m-1 text-gray-800 bg-gray-200 p-3 rounded-md border border-gray-300 flex flex-row justify-between items-center">
                  <img
                    src={`http://localhost:3000${
                      products.find((p) => p._id === product.product).images[0]
                    }`}
                    alt="product"
                    className="w-8 h-8 object-cover mr-2 rounded-sm"
                  />
                  {products.find((p) => p._id === product.product).title}
                  {` (${
                    products.find((p) => p._id === product.product).price
                  }$)`}{" "}
                  {"\u00D7"}
                  <span className="font-extrabold ml-1">
                    {product.quantity}
                  </span>
                  {" = "}
                  {products.find((p) => p._id === product.product).price *
                    product.quantity}
                  $
                  <button
                    type="button"
                    onClick={() => {
                      setTotal(
                        total -
                          products.find((p) => p._id === product.product)
                            .price *
                            product.quantity
                      );
                      setSelectedProducts(
                        selectedProducts.filter(
                          (p) => p.product !== product.product
                        )
                      );
                    }}
                    className="bg-red-500 text-white rounded-full w-5 h-5 ml-4 flex justify-center items-center font-extrabold"
                  >
                    {"\u00D7"}
                  </button>
                </span>
              </div>
            ))}
        </div>
        {total > 0 && (
          <span className="m-4 font-medium text-gray-800">Total: {total}$</span>
        )}
        <button
          type="submit"
          disabled={selectedProducts.length === 0 || !customer}
          className="w-48 p-3 m-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          SUBMIT ORDER
        </button>
      </form>
    </section>
  );
}

export default AddOrder;
