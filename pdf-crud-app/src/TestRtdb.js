import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

const TestRtdb = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    // Reference the node you want to read
    const dataRef = ref(database, "setlists");

    // Listen for changes in the data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <h1>Realtime Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestRtdb;
