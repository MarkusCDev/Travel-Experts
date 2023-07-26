import React from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from './UserAuth';

const Navbar = () => {
  const { user, logOut } = useUserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
      console.log('Logged Out Successfully');
    } catch (err) {
      console.log(err, 'Logged Out Unsuccessful');
    }
  };

  if (!user) {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src="/globelogo.png" alt="Travel Experts" />
          </Link>
          <a
            role="button"
            className="navbar-burger is-hidden-desktop"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
            href="#"
            onClick={() => {
              const menu = document.getElementById("navbarMenu");
              menu.classList.toggle("is-active");
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className="navbar-menu" id="navbarMenu">
          <div className="navbar-end">
            <div className="navbar-item has-text-centered">
              <button className="button is-success">
                <Link to="/login">Login</Link>
              </button>
            </div>
            <div className="navbar-item has-text-centered">
              <button className="button is-primary">
                <Link to="/signup">Signup</Link>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src="/globelogo.png" alt="Travel Experts" />
        </Link>
        <a
          role="button"
          className="navbar-burger is-hidden-desktop"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarMenu"
          href="#"
          onClick={() => {
            const menu = document.getElementById("navbarMenu");
            menu.classList.toggle("is-active");
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu" id="navbarMenu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/travel">
            Travel
          </Link>
          <Link className="navbar-item" to="/blogs">
            Blogs
          </Link>
          <Link className="navbar-item" to="/reviews">
            Reviews
          </Link>
        </div>

        <div className="navbar-end">
          <Link className="navbar-item" to="/account">
            Account
          </Link>
          <div className="navbar-item has-text-centered">
            <button className="button is-danger" onClick={handleLogOut}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
