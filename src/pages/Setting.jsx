import { useState } from "react";
import { ModalPassword } from "../components/Modal";
import Toast from "../utils/Toast";

const Setting = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModal = () => {
    if (!data.oldPassword || !data.newPassword || !data.confirmNewPassword) {
      return Toast("error", "Please fill all fields");
    }

    if (
      data.oldPassword.length < 8 ||
      data.newPassword.length < 8 ||
      data.confirmNewPassword.length < 8
    ) {
      return Toast("error", "Password must be at least 8 characters");
    }

    setOpenModal(true);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 min-h-screen lg:py-0 md:mt-0 -mt-16">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-slate-100 text-center">
              Change Password
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 text-sm font-medium text-slate-100"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  onChange={handleChange}
                  value={data.oldPassword}
                  id="oldPassword"
                  min={8}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700 disabled:placeholder:text-slate-500"
                  placeholder="old password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className=" block mb-2 text-sm font-medium text-slate-100"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={data.newPassword}
                  onChange={handleChange}
                  min={8}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:bg-gray-300 disabled:text-slate-700 disabled:cursor-not-allowed disabled:placeholder:text-slate-500"
                  placeholder="new password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-slate-100"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={data.confirmNewPassword}
                  onChange={handleChange}
                  min={8}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:bg-gray-300 disabled:text-slate-700 disabled:cursor-not-allowed disabled:placeholder:text-slate-500"
                  placeholder="confirm new password"
                  required
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleModal}
                  disabled={
                    !data.oldPassword ||
                    !data.newPassword ||
                    !data.confirmNewPassword
                  }
                  className="w-1/2 text-slate-100 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700
                  "
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {openModal && (
        <ModalPassword
          onClose={() => setOpenModal(false)}
          data={data}
          setData={setData}
        />
      )}
    </section>
  );
};

export default Setting;
