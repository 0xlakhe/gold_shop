import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const reg = await register({
        username: username,
        email: email,
        password: password,
      });
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/login");
    }
  };
  return (
    <div>
      <div>
        <form className="p-4" onSubmit={handleRegister}>
          <div className="flex flex-col gap-4">
            <div className="username">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-amber-200 ml-4"
              />
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                className="border border-amber-200 ml-4"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password">
              <label htmlFor="password" id="password" value={password}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-amber-200 ml-4"
              />
            </div>
          </div>
          <button type="submit" className="mt-5 bg-amber-200 hover:cursor-pointer">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
