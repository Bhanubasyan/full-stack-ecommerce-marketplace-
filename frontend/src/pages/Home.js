import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

import image2 from "../assets/hero/image2.png";
import image3 from "../assets/hero/image3.png";
import image4 from "../assets/hero/image4.png";
import image5 from "../assets/hero/image5.png";
import image6 from "../assets/hero/image6.png";
import image7 from "../assets/hero/image7.png";
import image8 from "../assets/hero/image8.png";
import image9 from "../assets/hero/image9.png";
function Home() {
  const heroImages = [
  
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();

  // ✅ STEP 2 — IMAGE PRELOAD YAHAN LIKH
  
   // slider interval wala useEffect neeche rahega
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, 5000); // thoda slow for luxury feel

  return () => clearInterval(interval);
}, []);


  const fetchProducts = async (keyword = "", selectedCategory = "") => {
    try {
      let url = `/products?keyword=${keyword}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await API.get(url);
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search, category);
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    fetchProducts(search, selected);
  };

  const addToCart = async (productId) => {
    try {
      await API.post("/cart", {
        productId,
        quantity: 1,
      });
      alert("Added to Cart!");
    } catch (error) {
      alert("Please login first");
      navigate("/login");
    }
  };

  return (
    <>
      {/* HERO SECTION FULL WIDTH */}
   <section className="home-hero">
  {heroImages.map((img, index) => (
    <div
      key={index}
      className={`hero-slide ${index === current ? "active" : ""}`}
      style={{ backgroundImage: `url(${img})` }}
    />
  ))}

  <div className="overlay"></div>

  <div className="hero-content">
    <h1>Crafted from Earth, Made for You</h1>
    <p>Discover timeless handmade pottery by Clayora artisans.</p>
    <button
      onClick={() =>
        window.scrollTo({ top: 800, behavior: "smooth" })
      }
    >
      Explore Collection
    </button>
  </div>
</section>
      {/* MAIN CONTENT */}
      <div className="home-container">
        {/* SEARCH + FILTER */}
        <div className="filter-section">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search pottery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-dropdown"
          >
            <option value="">All Categories</option>
            <option value="Pottery">Pottery</option>
            <option value="Wood">Wood</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="product-link"
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
              </Link>

              <p className="price">₹ {product.price}</p>

              <button onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;