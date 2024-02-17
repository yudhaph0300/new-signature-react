import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SearchBar = () => {
  const { search } = useParams();
  const navigate = useNavigate();
  const [searchFurniture, setSearchFurniture] = useState(search);

  const handleChange = (search) => {
    setSearchFurniture(search);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/furnitures/result/${searchFurniture}`);
  };
  return (
    <form onSubmit={handleSearch}>
      <div className="search-container mx-auto">
        <input
          type="text"
          className="form-control rounded-pill search-input ms-2"
          placeholder="Search for furniture..."
          value={searchFurniture}
          onChange={(e) => handleChange(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary rounded-pill search-button"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
