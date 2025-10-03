import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Role-based redirects
      if (data.user.role === "author") {
        if (data.user.name.toLowerCase().includes("ana huang")) {
          navigate("/author/anahuang/dashboard");
        } else if (data.user.name.toLowerCase().includes("martha nussbaum")) {
          navigate("/author/marthanussbaum/dashboard");
        } else {
          navigate("/author/dashboard");
        }
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
