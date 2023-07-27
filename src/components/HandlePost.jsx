import { useEffect, useState } from "react";
import Toast from "../utils/Toast";
import axios from "axios";
import Cookie from "js-cookie";

const URL = import.meta.env.VITE_APP_BASE_URL;

const HandlePost = ({ onClose, name, post, refetch, edit, create }) => {
  const token = Cookie.get("token");

  const [data, setData] = useState({
    image: post?.image || null,
    caption: post?.caption || "",
    tags: post?.tags || "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOnClose = (e) => {
    e.target.id === "container" && onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const { files } = e.target;
    const reader = new FileReader();

    setSelectedImage(files[0]);

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    if (files) {
      reader.readAsDataURL(files[0]);

      setData((prev) => ({
        ...prev,
        image: files[0],
      }));
    }
  };

  const updatePost = (image) => {
    axios(`${URL}/post/${post?.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        caption: data?.caption,
        tags: data?.tags,
        image: image || data?.image,
      },
    })
      .then((res) => {
        Toast("success", res.data.message);
        refetch();
        onClose();
      })
      .catch((error) => {
        Toast("error", error.response.data.message);
      });
  };

  const createPost = (img) => {
    axios(`${URL}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        caption: data?.caption,
        tags: data?.tags,
        image: img,
      },
    })
      .then((response) => {
        Toast("success", response?.data.message);
        refetch();
        onClose();
      })
      .catch((error) => {
        Toast("error", error.response.data.message);
        onClose();
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.caption || !data.tags) {
      Toast("error", "Please fill the form");
      return;
    }

    if (data.caption.length > 100) {
      Toast("error", "Max caption 100");
      return;
    }

    if (data.tags.split(" ").length > 2) {
      Toast("error", "Max tags 2");
      return;
    }

    const tags = data.tags.split(" ");
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].charAt(0) !== "#") {
        Toast("error", "Tags must start with #");
        return;
      }
    }

    if (edit) {
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

            return updatePost(image);
          })
          .catch((error) => {
            Toast("error", error.response.data.message);
          });
      } else {
        updatePost();
      }
    }

    if (create) {
      const data = new FormData();

      data.append("image", selectedImage);

      axios(`${URL}/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      })
        .then((response) => {
          const img = response.data.data.url;
          return createPost(img);
        })
        .catch((error) => {
          Toast("error", error.response.data.message);
          onClose();
        });
    }
  };

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center transition-all"
    >
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 min-h-screen lg:py-0 md:mt-0 -mt-16">
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-slate-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-slate-100 text-center">
                {name} Post
              </h1>
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="image"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImage}
                    className="cursor-pointer border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm file:rounded-md file:border-0 file:text-slate-100 file:bg-slate-500 file:hover:bg-slate-600 file:px-2 file:py-1 file:cursor-pointer file:mr-2 file:bg-transparent disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700"
                  />

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="preview image"
                      className="mt-8"
                      width={150}
                    />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="caption"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
                  >
                    Caption
                  </label>
                  <input
                    type="text"
                    name="caption"
                    id="caption"
                    onChange={handleChange}
                    value={data?.caption}
                    className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700 disabled:placeholder:text-slate-500"
                    placeholder="caption"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block mb-2 text-sm font-medium text-slate-100"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    onChange={handleChange}
                    value={data?.tags}
                    className="border border-slate-600 text-slate-100 md:text-md text-sm rounded-lg block w-full md:p-2.5 p-2 bg-slate-800 dark:bg-slate-700  placeholder:md:text-md placeholder:text-sm disabled:bg-gray-300 disabled:text-slate-700 disabled:cursor-not-allowed disabled:placeholder:text-slate-500"
                    placeholder="tags (#sunset #nature)"
                    required
                  />
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 text-slate-100 hover:bg-red-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700
                  "
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                      (data?.caption === post?.caption &&
                        data?.tags === post?.tags &&
                        !selectedImage) ||
                      (data?.caption === "" &&
                        data?.tags === "" &&
                        !selectedImage)
                    }
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
      </section>
    </div>
  );
};

export default HandlePost;
