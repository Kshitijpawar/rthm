import SetList from "./SetList";
import useFetchRtdb from "./useFetchRtdb";

const ViewSetlists = () => {
  const { data: sets, isPending, error } = useFetchRtdb("setlistsNew");

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading</div>}

      {sets && <SetList sets={sets} title="All Sets" />}
    </div>
  );
};

export default ViewSetlists;
