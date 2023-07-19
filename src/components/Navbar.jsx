import React from 'react'
import { Link } from 'react-router-dom'
import { useUserAuth } from './UserAuth'

const Navbar = () => {
  
  const { user, logOut } = useUserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
      console.log("Logged Out Successfully");
    } catch (err) {
      console.log(err, "Logged Out Unsuccessful");
    }
  };
  
    if (!user) {
    return (
        <nav>
            <ul>
                <li><Link to="/">Landing</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </ul>
        </nav>
    )
    }

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/reviews">Reviews</Link></li>
                <li><Link to="/account">Account</Link></li>
            </ul>
                <button onClick={handleLogOut}>Logout</button>
        </nav>
    )
}

export default Navbar