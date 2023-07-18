import React from "react";
import { useUserAuth } from "../components/UserAuth";
import { Link } from "react-router-dom";
import ChatGpt from "../components/ChatGpt";

const Home = () => {
  const { user, logOut } = useUserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
      console.log("you are logged out");
    } catch (e) {
      console.log("log out unsuccessful");
    }
  };
  if (!user) {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome User!</h1>
      <button onClick={handleLogOut}>LogOut</button>
      <button>
        <Link to="/blogs">Blogs</Link>
      </button>
      <ChatGpt />
    </div>
  );
};

export default Home;
