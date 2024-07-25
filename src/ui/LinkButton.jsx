import { Link } from "react-router-dom";

function LinkButton({ children, to }) {
  const className = "text-xl text-blue-500 hover:text-blue-600 mt-2";

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default LinkButton;
