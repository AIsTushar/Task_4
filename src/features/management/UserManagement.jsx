import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Toolbar from "../../ui/Toolbar";

import Header from "../../ui/Header";
import { toast } from "react-toastify";

import useCheckUserStatus from "../../services/CheckUserStatus";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useCheckUserStatus();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    };

    fetchUsers();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown-menu") === null) {
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (event, id) => {
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setSelectedUsers([id]);

    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const isSelected = (id) => selectedUsers.includes(id);

  const handleBlock = async () => {
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach((userId) => {
        const userRef = doc(db, "Users", userId);
        batch.update(userRef, { status: "blocked" });
      });

      await batch.commit();
      toast.success("Selected users have been blocked.", { autoClose: 2000 });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "blocked" }
            : user
        )
      );
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to block selected users.", { autoClose: 2000 });
    }
  };

  const handleUnblock = async () => {
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach((userId) => {
        const userRef = doc(db, "Users", userId);
        batch.update(userRef, { status: "active" });
      });
      await batch.commit();
      toast.success("Selected users have been unblocked.", { autoClose: 2000 });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
        )
      );
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to unblock selected users.", { autoClose: 2000 });
    }
  };

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);

      selectedUsers.forEach((userId) => {
        const userRef = doc(db, "Users", userId);
        batch.delete(userRef);
      });

      await batch.commit();

      toast.success("Selected users have been deleted.", { autoClose: 2000 });

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Failed to delete selected users.", { autoClose: 2000 });
    }
  };

  return (
    <div className="p-4">
      <Header userCount={users.length} />

      <div className="flex justify-between">
        <Toolbar
          handleBlock={handleBlock}
          handleUnblock={handleUnblock}
          handleDelete={handleDelete}
          selectedUsers={selectedUsers}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedUsers.length === users.length}
                />
              </th>
              <th className="p-2 border-b w-1/4 text-left">Name</th>
              <th className="p-2 border-b w-1/4 text-left">Email</th>
              <th className="p-2 border-b w-1/6 text-left">Date Added</th>
              <th className="p-2 border-b w-1/6 text-left">Last Active</th>
              <th className="p-2 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border-b w-10">
                  <input
                    type="checkbox"
                    checked={isSelected(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td className="p-2 border-b w-full flex items-center">
                  <img
                    src={`https://i.pinimg.com/564x/68/06/bb/6806bb625e54968e2515bdaf257815e1.jpg`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-bold text-sm">{user.name}</div>
                    <div
                      className={`${
                        user.status === "active"
                          ? "text-sm text-green-400"
                          : "text-sm text-red-600"
                      } text-sm text-gray-600`}
                    >
                      {user.status}
                    </div>
                  </div>
                </td>
                <td className="p-2 border-b w-1/4">{user.email}</td>
                <td className="p-2 border-b w-1/6">
                  {new Date(user.registrationTime).toLocaleDateString()}
                </td>
                <td className="p-2 border-b w-1/6">
                  {new Date(user.lastLoginTime).toLocaleDateString()}
                </td>
                <td className="p-2 border-b w-10 relative">
                  <button
                    onClick={(e) => toggleDropdown(e, user.id)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <BsThreeDotsVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDropdownId && (
        <div
          className="dropdown-menu absolute bg-white border border-gray-300 rounded shadow-lg z-10"
          style={{
            top: dropdownPosition.top + 20,
            left: dropdownPosition.left,
          }}
        >
          <ul className="flex items-center justify-center flex-col">
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={handleDelete}
            >
              Delete
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={handleBlock}
            >
              Block
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={handleUnblock}
            >
              Unblock
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
