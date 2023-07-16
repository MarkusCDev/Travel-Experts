import React, { useState } from "react";
import { useUserAuth } from "./UserAuth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      await addUserdata();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const addUserdata = async (e) => {
    await setDoc(doc(db, "Users", email), {
      email,
      blogs: [],
    })
      .then((docRef) => {
        console.log("Document Id:", docRef.id);
      })
      .catch((error) => {
        console.log("Error adding document:", error);
      });
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <button><Link to="/login">Login Here</Link></button>
      </form>
    </div>
  );
};

export default Signup;
