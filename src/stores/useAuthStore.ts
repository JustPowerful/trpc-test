import { create } from "zustand";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";

// Create a vanilla tRPC client for use outside React components
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

interface IAuth {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: null | {
    firstname: string;
    lastname: string;
    id: number;
    email: string;
  };
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<IAuth>((set, get) => {
  const validateUser = async (token: string) => {
    set({ loading: true });
    try {
      const { user } = await trpcClient.auth.verifyToken.mutate({ token });
      set({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Token validation failed:", error);
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({
        isAuthenticated: false,
        user: null,
        token: undefined,
        error: null, // Don't show error for invalid stored token
        loading: false,
      });
    }
  };

  // Define initialize function to be called on client side
  const initialize = () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (token) {
      validateUser(token);
    } else {
      set({ loading: false, isAuthenticated: false });
    }
  };
  // Define login function
  const login = async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await trpcClient.auth.login.mutate({
        email,
        password,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      set({
        isAuthenticated: true,
        user,
        token,
        loading: false,
      });
    } catch (error) {
      console.error("Login failed:", error);
      set({
        isAuthenticated: false,
        user: null,
        token: undefined,
        error: "Login failed. Please check your credentials.",
        loading: false,
      });
    }
  };
  // Define logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({
      isAuthenticated: false,
      user: null,
      token: undefined,
      loading: false,
      error: null,
    });
  };
  // Define register function
  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => {
    set({ loading: true, error: null });
    try {
      await trpcClient.auth.register.mutate({
        email,
        password,
        firstname,
        lastname,
      });
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      set({
        error: "Registration failed. Please try again.",
        loading: false,
      });
    }
  };

  return {
    isAuthenticated: false,
    loading: true, // Start with loading true since we need to initialize
    error: null,
    user: null,
    token: undefined,
    login,
    logout,
    register,
    initialize,
  };
});
