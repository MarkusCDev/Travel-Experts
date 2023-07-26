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

  const addUserdata = async () => {
    try {
      await setDoc(doc(db, "Users", email), {
        email,
        blogs: [],
        reviews: [],
      });
      console.log("Document added successfully");
    } catch (error) {
      console.log("Error adding document:", error);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <div className="box">
              <h1 className="title has-text-centered">Sign Up</h1>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      className="input"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      className="input"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div class="column">
                  <button class="button is-primary is-fullwidth" type="submit">
                    Sign Up
                  </button>
                </div>
                <div class="has-text-centered">
                  <p class="is-size-6">
                    Already have an account?<Link to="/signup"> Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

