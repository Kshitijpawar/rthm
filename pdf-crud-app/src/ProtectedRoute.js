import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { authObj } from "./firebase";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authObj, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    ); // to do add a spinner
  }

  return user ? children : navigate("/auth");
};

export default ProtectedRoute;
