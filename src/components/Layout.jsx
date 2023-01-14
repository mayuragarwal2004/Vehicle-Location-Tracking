import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./css/layout.css";

const Layout = () => {
  return (
    <>
      <header>
        <div className="layout-header">
          <div className="layout-header-left">
            <div className="layout-web-name">Location</div>
          </div>
          <div className="layout-header-right">
            <Link to="/">
              <div className="layout-header-links">Home</div>
            </Link>
            <Link to="/maps">
              <div className="layout-header-links">Maps</div>
            </Link>
            <Link to="/about">
              <div className="layout-header-links">About</div>
            </Link>
            <Link to="/about">
              <div className="layout-header-links">About</div>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
      <footer>footer</footer>
    </>
  );
};

export default Layout;
