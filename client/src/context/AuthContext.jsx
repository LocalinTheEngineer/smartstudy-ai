import { useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";
import { AuthContext } from "./authContextInstance";

function getStoredUser() {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  // Sayfa yenilendiginde, daha once giris yapilmissa kullaniciyi bir efekt
  // beklemeden, ilk render'da "lazy" state baslangiciyla hemen hatirliyoruz -
  // bu hem daha basit hem de bir "loading" araya girmesini gereksiz kiliyor.
  const [user, setUser] = useState(getStoredUser);

  async function login(email, password) {
    const res = await loginUser({ email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(name, email, password) {
    const res = await registerUser({ name, email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    logoutUser();
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
