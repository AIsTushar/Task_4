import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc } from "firebase/firestore";
import SidePart from "../../ui/SidePart";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../auth/authSlice";
import bcrypt from "bcryptjs";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) return;

    try {
      const userDocRef = doc(db, "Users", email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await setDoc(userDocRef, {
        email,
        name,
        password: hashedPassword,
        registrationTime: new Date().toISOString(),
        lastLoginTime: new Date().toISOString(),
        status: "active",
      });

      dispatch(setUser({ email, name, status: "active" }));

      navigate("/");
      toast.success("User Registration successful!!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(error.message, { position: "bottom-right", autoClose: 2000 });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-14 bg-stone-400 ">
      <div className="flex rounded-md overflow-hidden">
        {/* Left Section */}
        <SidePart />
        {/* Right Section */}
        <div className="flex flex-col justify-center p-12 bg-white md:w-1/2">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
            <p className="mb-6">
              The faster you fill up, the faster you get a ticket
            </p>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
                  placeholder="Enter your Fullname"
                  required
                />
              </div>
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
                Signup
              </button>
            </form>

            <p className="text-center mt-4">
              Allready have an account?
              <Link to="/" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
