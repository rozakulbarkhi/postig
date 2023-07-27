import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col justify-center items-center  min-h-screen">
      <h1>Error</h1>
      <p>{error.statusText}</p>
    </div>
  );
};

export default ErrorPage;
