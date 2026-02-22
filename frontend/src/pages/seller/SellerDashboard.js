import { Link, Outlet } from "react-router-dom";
import "./seller.css";

function SellerDashboard() {
return (
  <div className="seller-container">

    {/* SIDEBAR */}
    <div className="seller-sidebar">
      <h2 className="seller-title">Clayora Seller</h2>

      <nav className="seller-nav">
        <Link to="products">My Products</Link>
        <Link to="add-product">Add Product</Link>
        <Link to="orders">Orders</Link>
      </nav>
    </div>

    {/* MAIN CONTENT */}
    <div className="seller-content">
      <Outlet />
    </div>

  </div>
);
}

export default SellerDashboard;
