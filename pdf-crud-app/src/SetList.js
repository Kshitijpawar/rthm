import { Link } from "react-router-dom";

const SetList = ({ sets, title }) => {
  // console.log(sets);
  return (
    <div className="set-list">
      <h2>{title}</h2>
      {sets.map((set) => (
        <div className="set-preview" key={set.id}>
          <Link to={`/setlists/${set.id}`}>
            <h2>{set.setlist_name}</h2>
            <p>Performance Date : {set.performance_date}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SetList;
