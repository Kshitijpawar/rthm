// import BlogList from "./BlogList";
import SetList from "./SetList";
// import useFetch from "./useFetch";
// import {database} from "./firebase";
import useFetchRtdb from "./useFetchRtdb";

const Home = () => {
  // const {
  //   data: sets,
  //   isPending,
  //   error,
  // } = useFetch("http://localhost:8000/setlists");
  const { data: sets, isPending, error } = useFetchRtdb("setlistsNew");


  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading</div>}

      {sets && <SetList sets={sets} title="All Sets" />}
      {/* {sets && <Setlist sets = {sets} />} */}
    </div>
  );
};

export default Home;
