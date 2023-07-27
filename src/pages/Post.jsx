import axios from "axios";
import Cookie from "js-cookie";
import { useQuery } from "react-query";
import { CgDanger } from "react-icons/cg";
import jwtDecode from "jwt-decode";
import Search from "../components/Search";
import FloatingButton from "../components/FloatingButton";
import { useEffect, useState } from "react";
import LikeButton from "../components/LikeButton";
import HandlePost from "../components/HandlePost";
import { ModalDeletePost } from "../components/Modal";
import { twMerge } from "tailwind-merge";
import { useLocation } from "react-router-dom";

const Post = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
    limit: 8,
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caption = queryParams.get("caption") || "";
  const tags = queryParams.get("tags") || "";

  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const token = Cookie.get("token");
  const decoded = jwtDecode(token);

  const { isLoading, error, data, refetch, isFetching } = useQuery({
    queryKey: ["feed_user"],
    queryFn: async () => {
      const queryString =
        `page=${pageInfo.page}` +
        (caption && caption.trim() !== ""
          ? `&caption=${encodeURIComponent(caption)}`
          : "") +
        (tags && tags.trim() !== "" ? `&tags=${encodeURIComponent(tags)}` : "");

      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/post/user/${
          decoded?.id
        }?${queryString}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPageInfo((prev) => ({
        ...prev,
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        limit: response.data.pagination.limit,
      }));

      return response.data.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (pageInfo.page) {
      refetch();
    }
  }, [pageInfo.page, refetch]);

  useEffect(() => {
    if (caption || caption === "" || tags || tags === "") {
      refetch();
    }
  }, [caption, refetch, tags]);

  if (isLoading) {
    return <div className="mt-4">Loading...</div>;
  }

  if (error) {
    return (
      <>
        <Search setPageInfo={setPageInfo} />

        <div className="grid place-items-center h-screen -mt-24">
          <div className="flex items-center gap-4 text-xl">
            <CgDanger size={28} />
            <div className="text-red-700">No data available</div>
          </div>
        </div>

        <FloatingButton />
      </>
    );
  }

  const handleChangePage = (page) => {
    setPageInfo((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleModalEdit = (id) => {
    setModalEdit((prev) => !prev);
    setSelectedPost(id);
  };

  const handleModalDelete = (id) => {
    setModalDelete((prev) => !prev);
    setSelectedPost(id);
  };

  const pages = Array.from(
    { length: Math.ceil(pageInfo?.total / pageInfo?.limit) },
    (_, i) => i + 1
  );

  return (
    <>
      {isFetching ? (
        <div>Fetching...</div>
      ) : (
        <>
          <Search setPageInfo={setPageInfo} />
          <div>
            <>
              <div className="mt-8 grid md:grid-cols-4 grid-cols-2 gap-6">
                {data?.map((post) => (
                  <div key={post?.id}>
                    <div className="max-w-sm border rounded-lg shadow-slate-600 shadow bg-slate-800 border-slate-700">
                      <img
                        className="rounded-t-lg object-cover w-full h-44"
                        src={post?.image}
                        alt="image card"
                      />
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <LikeButton
                            postId={post?.id}
                            like={post?.likes}
                            refetch={refetch}
                            token={token}
                          />
                          <div>{post?.likes}</div>
                        </div>
                        <div className="font-semibold text-slate-200">
                          {post.user.username}
                        </div>
                        <div className="tracking-wide truncate">
                          {post?.caption}
                        </div>
                        <div className="mt-1 text-blue-400">{post?.tags}</div>

                        {location.pathname === "/post" && (
                          <div className="mt-4 cursor-pointer text-sm flex items-center justify-center text-center gap-4">
                            <button
                              className="w-1/2 py-1 capitalize rounded bg-red-700 hover:bg-red-600"
                              onClick={() => handleModalDelete(post?.id)}
                            >
                              delete
                            </button>
                            <button
                              type="button"
                              className="w-1/2 py-1 capitalize rounded bg-blue-700 hover:bg-blue-600"
                              onClick={() => handleModalEdit(post)}
                            >
                              edit
                            </button>
                          </div>
                        )}

                        {location.pathname === "/post" && (
                          <FloatingButton refetch={refetch} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {modalEdit && (
                  <HandlePost
                    onClose={() => setModalEdit(false)}
                    name="Edit"
                    edit={true}
                    refetch={refetch}
                    post={selectedPost}
                  />
                )}

                {modalDelete && (
                  <ModalDeletePost
                    onClose={() => setModalDelete(false)}
                    post={selectedPost}
                    refetch={refetch}
                  />
                )}
              </div>
              <nav className="mt-6">
                <ul className="flex justify-center">
                  <li>
                    <button
                      disabled={pageInfo?.page === 1}
                      onClick={() => handleChangePage(pageInfo?.page - 1)}
                      className="flex items-center justify-center px-3 h-8 ml-0 leading-tight border bg-slate-800 hover:bg-slate-700 border-slate-700 rounded-l-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700"
                    >
                      Prev
                    </button>
                  </li>

                  {pages.map((page) => (
                    <li key={page}>
                      <button
                        className={twMerge(
                          "flex items-center justify-center px-3 h-8 -ml-px leading-tight   disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-700 border-slate-700 border",
                          pageInfo?.page === page &&
                            "bg-blue-500 border hover:bg-blue-600"
                        )}
                        onClick={() => handleChangePage(page)}
                        disabled={page === pageInfo?.page}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button
                      className="flex items-center justify-center px-3 h-8 ml-0 leading-tight  disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-700 bg-slate-800 hover:bg-slate-700 border-slate-700 border rounded-r-lg"
                      onClick={() => handleChangePage(pageInfo?.page + 1)}
                      disabled={pageInfo?.page === pages?.length}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          </div>
        </>
      )}
    </>
  );
};

export default Post;
