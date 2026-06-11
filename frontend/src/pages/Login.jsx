import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await login({ identifier, password });
      localStorage.setItem("token", res.data.access_token);
      console.log(identifier, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username or email"
        value={identifier}
        className="border border-amber-200"
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-amber-200"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-amber-200 hover:cursor-pointer" onClick={handleSubmit}>Login</button>
      <br />
      <br />
      <button className="font-bold text-amber-300 hover:cursor-pointer" onClick={()=>navigate("/register")}>Register here</button>
    </div>
  );
}

export default Login;
