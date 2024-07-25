// useCheckUserStatus.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { clearUser, setUser } from "../features/auth/authSlice";

const useCheckUserStatus = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const userDocRef = doc(db, "Users", user.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.status === "blocked") {
            dispatch(clearUser());
            navigate("/login");
          } else {
            dispatch(setUser(userData));
          }
        }
      }
    };

    checkStatus();
  }, [user, navigate, dispatch]);
};

export default useCheckUserStatus;
