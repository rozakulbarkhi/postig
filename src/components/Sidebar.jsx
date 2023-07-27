import { useEffect, useRef, useState } from "react";
import Home from "../pages/Home";
import User from "../pages/User";
import Setting from "../pages/Setting";
import Post from "../pages/Post";
import { AiFillHome } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import Toast from "../utils/Toast";
import axios from "axios";
import Cookie from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setOpen((prev) => !prev);
  };

  const token = Cookie.get("token");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        open
      ) {
        setOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscapeKey, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("keydown", handleEscapeKey, true);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Cookie.remove("token");

        navigate("/");
      }
    } catch (error) {
      Toast("error", error.message);
    }
  };

  const handleMenu = (menu) => {
    setSelectedMenu(menu);

    if (window.innerWidth < 640) {
      setOpen(false);
    }
  };

  const isMenuActive = (menu) => {
    return selectedMenu === menu ? "bg-blue-700" : "";
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Home":
        return <Home />;
      case "user":
        return <User />;
      case "setting":
        return <Setting />;
      case "post":
        return <Post />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={handleSidebarToggle}
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          open
            ? "translate-x-0 transition ease-in-out duration-300"
            : "-translate-x-full transition ease-in-out duration-300"
        } sm:translate-x-0`}
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="flex flex-col justify-between items-center w-full h-full">
            <div className="w-full flex flex-col space-y-2 font-medium">
              <Link to="/dashboard">
                <li
                  onClick={() => handleMenu("home")}
                  className={twMerge(
                    "items-center p-2 rounded-lg text-slate-100 group hover:bg-gray-700 cursor-pointer",
                    isMenuActive("home"),
                    isMenuActive("home") && "hover:bg-blue-700"
                  )}
                >
                  <AiFillHome className="w-full" size={20} />
                </li>
              </Link>
              <Link to="/user">
                <li
                  onClick={() => handleMenu("user")}
                  className={twMerge(
                    "items-center p-2 rounded-lg text-slate-100 group hover:bg-gray-700 cursor-pointer",
                    isMenuActive("user"),
                    isMenuActive("user") && "hover:bg-blue-700"
                  )}
                >
                  <span className="flex justify-center">User</span>
                </li>
              </Link>
              <Link to="/setting">
                <li
                  onClick={() => handleMenu("setting")}
                  className={twMerge(
                    "items-center p-2 rounded-lg text-slate-100 group hover:bg-gray-700 cursor-pointer",
                    isMenuActive("setting"),
                    isMenuActive("setting") && "hover:bg-blue-700"
                  )}
                >
                  <span className="flex justify-center">Change Password</span>
                </li>
              </Link>
              <Link to="/post">
                <li
                  onClick={() => handleMenu("post")}
                  className={twMerge(
                    "items-center p-2 rounded-lg text-slate-100 group hover:bg-gray-700 cursor-pointer",
                    isMenuActive("post"),
                    isMenuActive("post") && "hover:bg-blue-700"
                  )}
                >
                  <span className="flex justify-center">Post</span>
                </li>
              </Link>
            </div>
            <div className="w-full font-medium">
              <li
                className="items-center p-2 rounded-lg text-slate-100 hover:bg-gray-700 group cursor-pointer"
                onClick={handleLogout}
              >
                <span className="flex justify-center">Logout</span>
              </li>
            </div>
          </ul>
        </div>
      </aside>

      <div className="text-white md:px-12 md:py-6 px-4 py-4 sm:ml-64">
        {renderContent()}
      </div>
    </>
  );
};

export default Sidebar;
