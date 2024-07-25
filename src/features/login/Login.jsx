import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SidePart from "../../ui/SidePart";
import { db } from "../../firebase/firebase";
import bcrypt from "bcryptjs";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "Users", email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (userData.status === "blocked") {
          throw new Error("This account has been blocked. 💀");
        }

        if (passwordMatch) {
          await updateDoc(userDocRef, {
            lastLoginTime: new Date().toISOString(),
          });

          dispatch(
            setUser({ email, name: userData.name, status: userData.status })
          );

          toast.success("User Login successful!!", {
            position: "top-right",
            autoClose: 2000,
          });
          navigate("/userManagement");
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("User does not exist");
      }
    } catch (error) {
      toast.error(error.message, { position: "top-left", autoClose: 2000 });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-400 py-10 px-14">
      <div className="flex rounded-md overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col justify-center p-12 bg-white md:w-1/2">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
            <p className="mb-6">
              The faster you fill up, the faster you get a ticket
            </p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded mb-4"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-4">
              Don't have an account?
              <Link to="/register" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        {/* Right Section */}
        <SidePart />
      </div>
    </div>
  );
}

export default Login;
