import Search from "../components/Search";
import Feed from "../components/Feed";
import { CgDanger } from "react-icons/cg";
import axios from "axios";
import { useQuery } from "react-query";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

const Home = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
    limit: 8,
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caption = queryParams.get("caption") || "";
  const tags = queryParams.get("tags") || "";

  const token = Cookie.get("token");

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["feed_all"],
    queryFn: async () => {
      const queryString =
        `page=${pageInfo.page}` +
        (caption && caption.trim() !== ""
          ? `&caption=${encodeURIComponent(caption)}`
          : "") +
        (tags && tags.trim() !== "" ? `&tags=${encodeURIComponent(tags)}` : "");

      const response = await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/post?${queryString}`,
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
    pageInfo.page && refetch();
  }, [pageInfo.page, refetch]);

  useEffect(() => {
    if (caption || caption === "" || tags || tags === "") {
      refetch();
    }
  }, [caption, refetch, tags]);

  if (isLoading) {
    return <div className="mt-4">Loading...</div>;
  }

  if (isError) {
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

  return (
    <>
      {isFetching ? (
        <div>Fetching...</div>
      ) : (
        <div>
          <Search setPageInfo={setPageInfo} />

          <Feed
            data={data}
            refetch={refetch}
            token={token}
            home={true}
            pageInfo={pageInfo}
            handleChangePage={handleChangePage}
          />
        </div>
      )}
    </>
  );
};

export default Home;
