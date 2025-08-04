const categories = (req, res) => {
  //"Clothes", "Electronics", "Furniture", "Shoes", "Miscellaneous"
  const categories = [
    {
      id: 1,
      name: "Clothes",
      title: "New Arrivals in Clothes Category - Shop Now",
      image: "/uploads/categories/Clothes/Clothes.jpg",
    },
    {
      id: 2,
      name: "Electronics",
      title: "Latest Electronics - Explore Our Collection",
      image: "/uploads/categories/Electronics/Electronics.jpg",
    },
    {
      id: 3,
      name: "Furniture",
      title: "Stylish Furniture - Upgrade Your Space",
      image: "/uploads/categories/Furniture/Furniture.jpg",
    },
    {
      id: 4,
      name: "Shoes",
      title: "Trendy Shoes - Step Up Your Style",
      image: "/uploads/categories/Shoes/Shoes.jpg",
    },
    {
      id: 5,
      name: "Miscellaneous",
      title: "Miscellaneous Items - Discover Unique Finds",
      image: "/uploads/categories/Miscellaneous/Miscellaneous.jpg",
    },
  ];
  res.status(200).send(categories);
};

module.exports = categories;
