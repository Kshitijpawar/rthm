import { useState, useEffect } from "react";
import { ref, get } from "firebase/database"; // Import Firebase Realtime Database functions
import { database } from "./firebase";

const useFetchRtdb = (path) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const dbRef = ref(database, path);
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
          console.error("Data not found at path:", path);
          throw new Error("Data not found.");
        }

        setData(snapshot.val());
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, isPending, error };
};

export default useFetchRtdb;
