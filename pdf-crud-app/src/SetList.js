import { Link } from "react-router-dom";

const SetList = ({ sets, title }) => {
  return (
    <div className="set-list">
      <h2>{title}</h2>
      {Object.entries(sets).map(([key, set]) => {
        // Log the key and set for debugging

        return (
          <div className="set-preview" key={key}>
            <Link to={`/setlists/${key}`}>
              <h2>{set.setlist_name}</h2>
              <p>Performance Date: {set.performance_date}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SetList;
