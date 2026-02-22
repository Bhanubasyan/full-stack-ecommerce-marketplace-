import { useEffect, useState } from "react";
import API from "../services/api";
import "./admin.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    await API.post("/products", form);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: ""
    });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

return (
  <div className="admin-container">

    <h2 className="admin-title">Admin Dashboard</h2>

    {/* CREATE PRODUCT */}
    <div className="admin-form-card">
      <h3>Add New Product</h3>

      <form className="admin-form" onSubmit={createProduct}>
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <button type="submit" className="primary-btn">
          Create Product
        </button>
      </form>
    </div>

    {/* PRODUCT LIST */}
    <div className="admin-products-section">
      <h3>All Products</h3>

      <div className="admin-products">
        {products.map((product) => (
          <div className="admin-product-card" key={product._id}>

            <img src={product.image} alt={product.name} />

            <div className="admin-product-info">
              <h4>{product.name}</h4>
              <p>₹ {product.price}</p>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteProduct(product._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>

  </div>
);
}

export default AdminDashboard;
