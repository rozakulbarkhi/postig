import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Search = ({ setPageInfo }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (search.trim() !== "") {
      if (search.includes("#")) {
        query.set("tags", search.replace("#", ""));
      } else {
        query.set("caption", search);
      }
    }

    setPageInfo((prev) => ({
      ...prev,
      page: 1,
    }));

    navigate(`?${query.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        name="search"
        placeholder="Search caption or #tags"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-none rounded pl-10 pr-4 py-1.5 px-2 md:text-md text-sm text-slate-700 border placeholder:md:text-md placeholder:text-sm focus:ring-0 focus:outline:none focus:border-transparent"
      />
      <AiOutlineSearch
        onClick={handleSearch}
        size={20}
        className="absolute text-slate-700 left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
      />
    </div>
  );
};

export default Search;
