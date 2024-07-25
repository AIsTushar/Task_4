import { AiOutlineDelete, AiOutlineUnlock } from "react-icons/ai";

function Toolbar({ handleBlock, handleUnblock, handleDelete, selectedUsers }) {
  return (
    <div className="mb-4 flex space-x-2">
      <button
        onClick={handleBlock}
        disabled={selectedUsers.length === 0}
        className={`${
          selectedUsers.length === 0 ? " cursor-not-allowed" : ""
        } bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 `}
      >
        Block
      </button>
      <button
        onClick={handleUnblock}
        disabled={selectedUsers.length === 0}
        className={
          `${selectedUsers.length === 0 ? " cursor-not-allowed" : ""} ` +
          "bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
        }
      >
        <AiOutlineUnlock className="mr-2" /> Unblock
      </button>
      <button
        onClick={handleDelete}
        disabled={selectedUsers.length === 0}
        className={
          `${selectedUsers.length === 0 ? " cursor-not-allowed" : ""} ` +
          "bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
        }
      >
        <AiOutlineDelete className="mr-2" /> Delete
      </button>
    </div>
  );
}

export default Toolbar;
