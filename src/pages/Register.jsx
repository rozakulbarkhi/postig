import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../utils/Toast";

const Register = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);

      // setData((prev) => ({
      //   ...prev,
      //   photo: file,
      // }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (data.password !== data.confirmPassword) {
        setData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        return Toast("error", "Password and Confirm Password must be same");
      }

      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/register`,
        {
          method: "POST",
          data: {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
          },
        }
      );

      if (response.data) {
        Toast("success", response.data.message);

        navigate("/");
      }
    } catch (error) {
      Toast("error", error.response.data.message);

      setData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setSelectedImage(null);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-slate-100 text-center">
              Register
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  id="name"
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm"
                  placeholder="name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
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
                  htmlFor="email"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={data.email}
                  onChange={handleChange}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm file:rounded-md file:border-0 file:text-slate-100 file:bg-slate-500 file:hover:bg-slate-600 file:px-2 file:py-1 file:cursor-pointer file:mr-2 file:bg-transparent"
                />

                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="preview image"
                    className="mt-8"
                    width={150}
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={
                  !data.name ||
                  !data.username ||
                  !data.email ||
                  !data.password ||
                  !data.confirmPassword
                }
                className="w-full text-slate-100 hover:bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700"
                style={{
                  marginTop: "2.5rem",
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
