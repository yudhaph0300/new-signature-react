import "./style/header.css";
const Header = ({ title }) => {
  return (
    <>
      <div className="header">
        <h3 className="fw-bold mt-3 text-white">{title}</h3>
      </div>
    </>
  );
};

export default Header;
