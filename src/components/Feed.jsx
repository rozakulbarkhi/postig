import FloatingButton from "./FloatingButton";
import LikeButton from "./LikeButton";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModalDeletePost } from "./Modal";
import HandlePost from "./HandlePost";
import { twMerge } from "tailwind-merge";

const Feed = ({
  data,
  refetch,
  token,
  user,
  isFetching,
  pageInfo,
  handleChangePage,
}) => {
  // const [modalEdit, setModalEdit] = useState(false);
  // const [modalDelete, setModalDelete] = useState(false);
  // const [selectedPost, setSelectedPost] = useState(null);

  const location = useLocation();

  // useEffect(() => {
  //   if (user) {
  //     refetch();
  //   }
  // }, [refetch, user]);

  // const handleModalEdit = (id) => {
  //   setModalEdit((prev) => !prev);
  //   setSelectedPost(id);
  // };

  // const handleModalDelete = (id) => {
  //   setModalDelete((prev) => !prev);
  //   setSelectedPost(id);
  // };

  const pages = Array.from(
    { length: Math.ceil(pageInfo?.total / pageInfo?.limit) },
    (_, i) => i + 1
  );

  return (
    <div>
      <div className="mt-8 grid md:grid-cols-4 grid-cols-2 gap-6">
        {/* {isFetching ? (
          <div>Loading...</div>
        ) : ( */}
        <>
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
                  <div className="tracking-wide truncate">{post?.caption}</div>
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

                  {location.pathname === "/post" && <FloatingButton />}
                </div>
              </div>
            </div>
          ))}
        </>
        {/* )} */}

        {/* {modalEdit && (
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
        )} */}
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
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight  disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-700 border-slate-700 border rounded-r-lg disabled:bg-gray-300 disabled:text-slate-700"
              onClick={() => handleChangePage(pageInfo?.page + 1)}
              disabled={pageInfo?.page === pages?.length}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Feed;
