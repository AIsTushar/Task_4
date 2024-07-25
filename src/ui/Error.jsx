import { useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function Error() {
  const error = useRouteError();

  return (
    <div className="h-dvh flex items-center justify-center flex-col">
      <h1 className="text-3xl mb-3">Something went wrong 😢</h1>
      <p className="text-xl">{error.data || error.message}</p>
      <LinkButton to="/">Go back &larr;</LinkButton>
    </div>
  );
}

export default Error;
