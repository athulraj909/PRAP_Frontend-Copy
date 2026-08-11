import "./SearchBox.css";

function SearchBox({ value, onChange }) {
  return (
    <input
      className="search-box"
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchBox;