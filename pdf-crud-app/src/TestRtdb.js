import React from "react";
import useFetchRtdb from "./useFetchRtdb";

function TestRtdb() {
  const { data, isPending, error } = useFetchRtdb("setlists", "id", "2");

  return (
    <div>
      <h1>Query Setlist by ID</h1>
      {isPending && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default TestRtdb;
