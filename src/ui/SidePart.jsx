function SidePart() {
  return (
    <div
      className="hidden w-1/2 bg-cover bg-center md:block"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/564x/15/1e/7a/151e7a902d35135d2d5a4bf600e076a7.jpg')",
      }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">User Management</h2>
          <p>
            This system allows users to register, log in, and manage user
            accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SidePart;
