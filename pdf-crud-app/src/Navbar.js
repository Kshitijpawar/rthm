import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Setlist</h1>
      <div className="links">
        <Link to="/">Home</Link>
        {/* <Link to="/testupload">TestUpload</Link> */}
        {/* <Link to="/createsetlist">CreateSetlist</Link> */}
        <Link to="/createsetlist">CreateSetlistNew</Link>
        {/* <Link to="/reactpdf">React File Upload</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
