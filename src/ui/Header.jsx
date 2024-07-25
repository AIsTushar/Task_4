import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/auth/authSlice";

function Header({ userCount }) {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="p-4 bg-white  border-gray-300">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">User management</h1>
          <p className="text-gray-600">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={`https://i.pinimg.com/564x/68/06/bb/6806bb625e54968e2515bdaf257815e1.jpg`}
            alt="user"
            className="w-10 h-10 rounded-full mr-2"
          />

          <p className="font-bold text-sm">{user.name}</p>
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
            onClick={handleLogout}
          >
            <CiLogout className="mr-2" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-lg font-semibold">
          All users <span className="text-gray-500">{userCount}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
