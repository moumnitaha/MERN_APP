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
            className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-2 w-64"
            key={product._id}
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={product.images[0]}
                alt={product.title}
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {product.images.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      className="w-8 h-8 object-cover rounded-full border-2 border-white"
                      src={image}
                      alt={`Product thumbnail ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between min-h-64">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-gray-800">
                  {product.title}
                </div>
                <p className="text-gray-700 text-base description-ellipsis">
                  {product.description}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2 ">
                <span className="text-gray-800 font-semibold text-lg">
                  ${product.price}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default Products;
