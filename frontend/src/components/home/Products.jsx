import React, { useState, useEffect } from "react";
import createApiInstance from "../../interceptors/interceptor.js";

const api = createApiInstance();

const getProduct = async (setProducts) => {
  try {
    const response = await api.get("/products");
    if (response.status === 200) {
      console.log("Products retrieved successfully");
      console.log(response.data);
      setProducts(response.data);
    } else {
      console.error("Error retrieving products");
    }
  } catch (error) {
    console.log(firstname, error);
  }
};

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProduct(setProducts);
  }, []);
  return (
    <section className="flex flex-row flex-wrap justify-center">
      {products?.map((product) => {
        return (
          <div
            key={product._id}
            className="m-4 p-4 border border-gray-300 w-1/4"
          >
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <div className="flex flex-row">
              {product?.images.map((image, index) => {
                return (
                  <img
                    src={image}
                    alt="product"
                    className="w-1/4 h-1/4 m-auto"
                    key={index}
                  />
                );
              })}
            </div>
            <p className="text-lg">{product.description}</p>
            <p className="text-lg">
              Price: {product.price}
              {"$"}
            </p>
            <h3 className="text-lg font-bold">
              Category: {product.category.name}
            </h3>
          </div>
        );
      })}
    </section>
  );
}

export default Products;
