import React, { useState, useEffect } from "react";
import createApiInstance from "../../interceptors/interceptor.js";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

const api = createApiInstance();

const getProduct = async (setProducts) => {
  try {
    const response = await api.get("/products");
    if (response.status === 200) {
      console.log("Products retrieved successfully");
      console.log(response.data.length);
      console.log(response.data[0]);
      setProducts(response.data);
    } else {
      console.error("Error retrieving products");
    }
  } catch (error) {
    console.log(error);
  }
};

function Products() {
  const [products, setProducts] = useState([]);
  const [priceSort, setPriceSort] = useState(1);
  const [categorySort, setCategorySort] = useState(1);
  const [ratingSort, setRatingSort] = useState(1);
  const [quantitySort, setQuantitySort] = useState(1);
  const [titleSort, setTitleSort] = useState(1);
  const [createdAtSort, setCreatedAtSort] = useState(1);
  const [updatedAtSort, setUpdatedAtSort] = useState(1);
  const [idSort, setIdSort] = useState(1);

  useEffect(() => {
    getProduct(setProducts);
  }, []);
  {
    products.length === 0 ? (
      <h1 className="text-2xl text-center">No products found</h1>
    ) : null;
  }
  return (
    <section className="pl-60 bg-[#f9f9f9] h-fit">
      <div className="flex flex-row items-center justify-around h-32">
        <input
          type="text"
          placeholder="Search"
          className="border border-slate-200 rounded-lg p-2 m-5"
          onChange={async (e) => {
            console.log(e.target.value);
            const response = await api.get(
              `/products?search=${e.target.value}`
            );
            if (response.status === 200) {
              setProducts(response.data);
            } else {
              console.error("Error retrieving products");
            }
          }}
        />
        <Nouislider
          className="w-1/2"
          range={{ min: 0, max: 100 }}
          start={[20, 80]}
          step={1}
          connect
          animate
          tooltips
          onChange={(values) => console.log(values)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="max-w-full bg-white border border-slate-200 rounded-lg shadow-sm m-5">
          <thead className="bg-slate-200 select-none">
            <tr>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium  cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) => idSort * a._id.localeCompare(b._id)
                  );
                  setIdSort(idSort * -1);
                  setProducts([...sortedProducts]);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  ID{" "}
                  {idSort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th className="text-left px-6 py-3 text-slate-800 font-medium">
                Image
              </th>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) => titleSort * a.title.localeCompare(b.title)
                  );
                  setTitleSort(titleSort * -1);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  Title{" "}
                  {titleSort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) =>
                      categorySort *
                      a.category.name.localeCompare(b.category.name)
                  );
                  setCategorySort(categorySort * -1);
                  setProducts([...sortedProducts]);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  Category{" "}
                  {categorySort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) => priceSort * b.price - priceSort * a.price
                  );
                  setPriceSort(priceSort * -1);
                  setProducts([...sortedProducts]);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  Price{" "}
                  {priceSort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) =>
                      quantitySort * b.quantity - quantitySort * a.quantity
                  );
                  setQuantitySort(quantitySort * -1);
                  setProducts([...sortedProducts]);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  Quantity{" "}
                  {quantitySort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th
                className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto"
                onClick={() => {
                  let sortedProducts = products.sort(
                    (a, b) => ratingSort * b.rates - ratingSort * a.rates
                  );
                  setRatingSort(ratingSort * -1);
                  setProducts([...sortedProducts]);
                }}
              >
                <span className="flex flex-row justify-between items-center">
                  Rating{" "}
                  {ratingSort === 1 ? (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  )}
                </span>
              </th>
              <th className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto">
                Orders
              </th>
              <th className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto">
                Refunds
              </th>
              <th className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto">
                Created At
              </th>
              <th className="text-left px-6 py-3 text-slate-800 font-medium cursor-pointer hover:text-blue-600 transition-colors hover:bg-slate-300 w-auto">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="hover:bg-slate-100 transition-colors duration-150 border border-t-blue-100"
              >
                <td className="px-6 py-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-slate-800 font-semibold hover:text-blue-600 transition-colors"
                  >
                    {"# "}
                    {index}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex items-center"
                  >
                    <img
                      className="min-w-14 min-h-14 max-h-16 max-w-16 aspect-square object-cover rounded-md border border-slate-200 hover:scale-150 transition-transform hover:border-blue-400"
                      src={
                        product.images[0] || "https://via.placeholder.com/300"
                      }
                      alt={product.title}
                      loading="lazy"
                    />
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-slate-800 font-semibold hover:text-blue-600 transition-colors"
                  >
                    {product.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700">
                    {product.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-semibold">
                    {product.price}$
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-semibold">
                    {product.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-semibold">
                    {product.rates}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-semibold">
                    {product.orders}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-semibold">
                    {product.refunds}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700">
                    {new Date(product.createdAt).toLocaleString("FR-fr")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700">
                    {new Date(product.updatedAt).toLocaleString("FR-fr")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Products;
