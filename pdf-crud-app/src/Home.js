import SetList from "./SetList";
import useFetchRtdb from "./useFetchRtdb";

const Home = () => {
  const { data: sets, isPending, error } = useFetchRtdb("setlistsNew");

console.log(sets)
  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading</div>}

      {sets && <SetList sets={sets} title="All Sets" />}
    </div>
  );
};

export default Home;
