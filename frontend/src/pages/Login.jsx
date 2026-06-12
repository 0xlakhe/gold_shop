import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { Landmark, LogIn } from "lucide-react";

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
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="app-page grid min-h-screen place-items-center px-4 py-10">
      <main className="panel w-full max-w-md overflow-hidden">
        <div className="panel-header text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-stone-950 text-amber-300">
            <Landmark size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-stone-950">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign in to manage the gold shop ledger.
          </p>
        </div>
        <div className="panel-body space-y-4">
          <div className="field">
            <label className="field-label" htmlFor="identifier">
              Username or email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Username or email"
              value={identifier}
              className="input"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button className="btn-primary w-full" onClick={handleSubmit}>
            <LogIn size={16} />
            Login
          </button>
          <button
            className="btn-secondary w-full"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
