import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../utils/Toast";
import Cookie from "js-cookie";
import withAuth from "../hooks/withAuth";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/login`,
        {
          method: "POST",
          data,
        }
      );

      if (response.status === 200) {
        Toast("success", response.data.message);

        Cookie.set("token", response.data.data.token, {
          expires: new Date(Date.now() + 15 * 60 * 1000),
        });

        navigate("/dashboard");
      }
    } catch (error) {
      Toast("error", error.response.data.message);

      setData({
        username: "",
        password: "",
      });
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-slate-100 text-center">
              Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-slate-100"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={data.username}
                  onChange={handleChange}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!data?.username || !data?.password}
                className="w-full text-slate-100 hover:bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700"
                style={{
                  marginTop: "2.5rem",
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withAuth(Login);
