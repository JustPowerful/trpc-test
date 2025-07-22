"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

const Register = () => {
  const register = trpc.auth.register.useMutation();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={userData.firstname}
        onChange={(event) => {
          setUserData({ ...userData, firstname: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={userData.lastname}
        onChange={(event) => {
          setUserData({ ...userData, lastname: event.target.value });
        }}
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(event) => {
          setUserData({ ...userData, email: event.target.value });
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(event) => {
          setUserData({ ...userData, password: event.target.value });
        }}
      />
      <button
        onClick={() => {
          register.mutate(userData);
        }}
      >
        Register
      </button>
      <p>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
