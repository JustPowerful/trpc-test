"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

const Login = () => {
  const login = trpc.auth.login.useMutation();
  const handleLogin = async () => {
    try {
      const result = await login.mutateAsync({
        email: loginData.email,
        password: loginData.password,
      });

      localStorage.setItem("token", result.token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  return (
    <div>
      <input
        value={loginData.email}
        onChange={(event) => {
          setLoginData({
            ...loginData,
            email: event.target.value,
          });
        }}
        type="text"
        placeholder="Email"
      />
      <input
        value={loginData.password}
        onChange={(e) => {
          setLoginData({
            ...loginData,
            password: e.target.value,
          });
        }}
        type="password"
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
