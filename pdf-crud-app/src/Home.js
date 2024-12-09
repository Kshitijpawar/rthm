import BlogList from "./BlogList";
import SetList from "./SetList";
import useFetch from "./useFetch";

const Home = () => {
  
  const {
    data: sets,
    isPending,
    error,
  } = useFetch("http://localhost:8000/setlists");
  console.log("printing sets")
  console.log(sets);
  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading</div>}

      {sets && <SetList sets={sets} title="All Sets" />}
    </div>
  );
};

export default Home;
