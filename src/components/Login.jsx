import React, { useState } from "react";
import { useUserAuth } from "./UserAuth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title">Log In</h1>
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
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-primary" type="submit">
                    Log In
                  </button>
                </div>
                <div className="control">
                  <button className="button is-text">
                    <Link to="/signup">Sign Up Here</Link>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
