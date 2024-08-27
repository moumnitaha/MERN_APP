import React, { useState, useEffect } from "react";
import createApiInstance from "../../interceptors/interceptor.js";
import { Link } from "react-router-dom";

const api = createApiInstance();

const getProduct = async (setProducts) => {
  try {
    const response = await api.get("/products");
    if (response.status === 200) {
      console.log("Products retrieved successfully");
      console.log(response.data.length);
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
  useEffect(() => {
    getProduct(setProducts);
  }, []);
  return (
    <section className="flex flex-row flex-wrap justify-start pl-60 bg-[#f9f9f9]">
      {products?.map((product) => {
        return (
          <Link
            to={`/product/${product._id}`}
            className="max-w-sm rounded overflow-hidden shadow-sm bg-white m-2 w-64 font-poppins hover:shadow-lg hover:scale-105 transition-all duration-200"
            key={product._id}
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={product.images[0] || "https://via.placeholder.com/300"}
                alt={product.title}
                loading="lazy"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  {product.images.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      className="w-8 h-8 object-cover rounded-full border-2 border-white shadow-lg"
                      src={image}
                      alt={`Product thumbnail ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between h-fit">
              <div className="px-6 py-4">
                <div className="font-bold text-xl text-gray-800 description-ellipsis">
                  {product.title}
                </div>
              </div>
              <div className="px-6 pb-2 ">
                <span className="text-gray-800 font-semibold text-lg">
                  {product.price}
                  {"$"}
                </span>
              </div>
              <div className="px-6 mb-4">
                <p className="text-gray-700">{product.category.name}</p>
              </div>
              {/* <div className="flex justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded flex-1 m-1 h-12">
                  Buy
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded flex-1 m-1 h-12">
                  Add to Cart
                </button>
              </div> */}
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default Products;
