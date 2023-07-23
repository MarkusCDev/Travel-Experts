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
            Landing
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <Link className="navbar-item" to="/login">
              Login
            </Link>
            <Link className="navbar-item" to="/signup">
              Signup
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
       <Link className="navbar-item" to="/">
          Home
        </Link>
      </div>
      <div className="navbar-brand">
       <Link className="navbar-item" to="/travel">
          Travel
        </Link>
      </div>

       <div className="navbar-brand">
       <Link className="navbar-item" to="/travel">
          Home
        </Link>
      </div>
      <div className="navbar-brand">
       <Link className="navbar-item" to="/travel">
          Travel
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
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
          <button className="button is-danger" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
