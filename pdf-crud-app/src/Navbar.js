import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { authObj } from "./firebase";

const Navbar = () => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [showDropdown, setShowDropdown] = useState(false); // Track dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(authObj, (currentUser) => {
      setUser(currentUser); // Set the user object if logged in, null otherwise
      // console.log(user);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(authObj);
      alert("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <h1>RTHM</h1>
      <div className="links">
        <Link to="/">Home</Link>
        {user && <Link to="/setlists">View all Setlists</Link>}
        {user && <Link to="/createsetlist">Create New Setlist</Link>}
        {!user && <Link to="/auth">Login/Signup</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
