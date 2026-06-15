import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Landmark, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({
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
    <div className="app-page grid min-h-screen place-items-center px-4 py-10">
      <main className="panel w-full max-w-md overflow-hidden">
        <div className="panel-header text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-stone-950 text-amber-300">
            <Landmark size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-stone-950 dark:text-stone-100">
            Create account
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Set up access for the inventory ledger.
          </p>
        </div>
        <form className="panel-body space-y-4" onSubmit={handleRegister}>
          <div className="field">
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <UserPlus size={16} />
            Register
          </button>
        </form>
      </main>
    </div>
  );
}

export default Register;
