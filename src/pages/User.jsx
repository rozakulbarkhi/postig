import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import Cookie from "js-cookie";
import { Modal } from "../components/Modal";
import Toast from "../utils/Toast";

const User = () => {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const token = Cookie.get("token");

  const {
    isLoading,
    error,
    data: user,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    },
  });

  isLoading && <div>Loading...</div>;

  if (error) {
    return <div>{error.message}</div>;
  }

  const renderImagePreview = () => {
    if (disabled) {
      return (
        <img
          src={user?.photo}
          alt="preview image"
          className="mt-8"
          width={150}
        />
      );
    }

    if (previewImage) {
      return (
        <img
          src={previewImage}
          alt="preview image"
          className="mt-8"
          width={150}
        />
      );
    }
  };

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

    setSelectedImage(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);

      setData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleEdit = () => {
    setDisabled(false);
  };

  const handleModal = () => {
    if (!data.name || !data.username || !data.email) {
      return Toast("error", "Please fill all fields");
    }

    setOpenModal(true);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 min-h-screen lg:py-0 md:mt-2 -mt-6">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-slate-100 text-center">
              Detail User
            </h1>
            <form className="space-y-4 md:space-y-6">
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
                  onChange={handleChange}
                  value={disabled ? user?.name : data?.name}
                  id="name"
                  disabled={disabled}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700 disabled:placeholder:text-slate-500"
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
                  value={disabled ? user?.username : data?.username}
                  onChange={handleChange}
                  disabled={disabled}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:bg-gray-300 disabled:text-slate-700 disabled:cursor-not-allowed disabled:placeholder:text-slate-500"
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
                  value={disabled ? user?.email : data?.email}
                  onChange={handleChange}
                  disabled={disabled}
                  className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:bg-gray-300 disabled:text-slate-700 disabled:cursor-not-allowed disabled:placeholder:text-slate-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-slate-100"
                >
                  Photo
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  disabled={disabled}
                  onChange={handleImageChange}
                  className="cursor-pointer border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm file:rounded-md file:border-0 file:text-slate-100 file:bg-slate-500 file:hover:bg-slate-600 file:px-2 file:py-1 file:cursor-pointer file:mr-2 file:bg-transparent disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700"
                />

                {renderImagePreview()}
              </div>
              <div className="flex items-center justify-center gap-4">
                {disabled ? (
                  <button
                    type="button"
                    className="w-1/2 text-slate-100 px-5 py-2.5 text-sm rounded-lg text-center bg-blue-700 hover:bg-blue-600 font-medium"
                    onClick={() => {
                      handleEdit();
                      setData({
                        name: user?.name,
                        username: user?.username,
                        email: user?.email,
                      });
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDisabled(true);
                    }}
                    className="w-1/2 text-slate-100 px-5 py-2.5 text-sm rounded-lg text-center bg-red-700 hover:bg-red-600 font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleModal}
                  className="w-1/2 text-slate-100 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700
                  "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {openModal && (
        <Modal
          onClose={() => setOpenModal(false)}
          selectedImage={selectedImage}
          data={data}
          user={user}
          disabledForm={() => setDisabled(true)}
          refetch={refetch}
        />
      )}
    </section>
  );
};

export default User;
