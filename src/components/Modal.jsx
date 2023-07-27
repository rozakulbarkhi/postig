import Cookie from "js-cookie";
import Toast from "../utils/Toast";
import axios from "axios";

const URL = import.meta.env.VITE_APP_BASE_URL;

const Content = (handleOnClose, onClose, handleSubmit, name) => {
  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center transition-all"
    >
      <div className="bg-white rounded p-4 h-1/5 md:w-1/4 w-3/4 text-black justify-center flex flex-col items-center">
        <div className="text-sm md:text-base">
          <p>Are you sure want to {name} this data?</p>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <button
            className="text-slate-100 px-5 py-2.5 text-sm rounded-lg text-center bg-red-700 hover:bg-red-600 font-medium capitalize mt-5 w-1/3"
            onClick={onClose}
          >
            no
          </button>
          <button
            className="text-slate-100 px-5 py-2.5 text-sm rounded-lg text-center bg-blue-700 hover:bg-blue-600 font-medium capitalize mt-5 w-1/3"
            onClick={handleSubmit}
          >
            confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({
  onClose,
  disabledForm,
  selectedImage,
  data,
  user,
  refetch,
}) => {
  const { name, username, email } = data;
  const { photo } = user;

  const token = Cookie.get("token");

  const handleOnClose = (e) => {
    e.target.id === "container" && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", selectedImage);

    if (selectedImage) {
      axios(`${URL}/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      })
        .then((response) => {
          const image = response.data.data.url;

          return updateUser(image);
        })
        .catch((error) => {
          Toast("error", error.response.data.message);
          onClose();
        });
    } else {
      updateUser();
    }
  };

  const updateUser = (image) => {
    axios(`${URL}/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        username,
        email,
        photo: image || photo,
      },
    })
      .then((response) => {
        Toast("success", response.data.message);

        onClose();
        disabledForm();
        refetch();
      })
      .catch((error) => {
        Toast("error", error.response.data.message);
        onClose();
      });
  };

  return Content(handleOnClose, onClose, handleSubmit, "update");
};

const ModalPassword = ({ onClose, data, setData }) => {
  const token = Cookie.get("token");

  const handleOnClose = (e) => {
    e.target.id === "container" && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios(`${URL}/user/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...data,
        },
      });

      if (response.data.success === true) {
        Toast("success", response.data.message);
        onClose();
        setData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error) {
      Toast("error", error.response.data.message);
      onClose();
      setData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  return Content(handleOnClose, onClose, handleSubmit, "update");
};

const ModalDeletePost = ({ onClose, post, refetch }) => {
  const token = Cookie.get("token");

  const handleOnClose = (e) => {
    e.target.id === "container" && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios(`${URL}/post/${post}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        Toast("success", response.data.message);
        onClose();
        refetch();
      }
    } catch (error) {
      Toast("error", error.response.data.message);
    }
  };

  return Content(handleOnClose, onClose, handleSubmit, "delete");
};

export { Modal, ModalPassword, ModalDeletePost };
