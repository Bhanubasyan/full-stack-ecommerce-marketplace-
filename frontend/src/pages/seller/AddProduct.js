import { useState } from "react";
import API from "../../services/api";
import "./seller.css";
function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,   // 👈 image file
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] }); // 👈 file store
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", form.price);
  formData.append("category", form.category);
  formData.append("stock", form.stock);

  if (form.image) {
    formData.append("image", form.image);
  }

  try {
    await API.post("/products", formData);   // ❌ NO HEADERS HERE
    alert("Product Added");
  } catch (error) {
    console.log(error.response?.data);
    alert("Error adding product");
  }
};
return (
  <div className="add-product-container">

    <div className="add-product-card">
      <h2 className="add-title">Add New Product</h2>

      <form onSubmit={handleSubmit} className="add-product-form">

        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          rows="3"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          required
        />

        {/* FILE INPUT */}
        <label className="file-label">
          Upload Product Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="primary-btn">
          Add Product
        </button>

      </form>
    </div>

  </div>
);
}

export default AddProduct;