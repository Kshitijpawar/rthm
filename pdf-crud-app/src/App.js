// import logo from './logo.svg';
import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import BlogDetails from "./BlogDetails";
import SetlistDetails from "./SetlistDetails";
// import Create from "./Create";
import TestUpload from "./TestUpload";
import NotFound from "./NotFound";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateSetlist from "./CreateSetlist";
import SongDetails from "./SongDetails";
import SetlistEdit from "./SetlistEdit";

function App() {
  // const person = {};
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>
            <Route path="/blogs/:id">
              <BlogDetails></BlogDetails>
            </Route>
            <Route path="/setlists/:setlistId/songs/:songId">
              <SongDetails></SongDetails>
            </Route>
            <Route path="/edit/:setlistId">
              <SetlistEdit></SetlistEdit>
            </Route>
            <Route path="/setlists/:id">
              <SetlistDetails></SetlistDetails>
            </Route>
            <Route path="/testupload">
              <TestUpload></TestUpload>
            </Route>
            <Route path="/createsetlist">
              <CreateSetlist></CreateSetlist>
            </Route>

            <Route path="*">
              <NotFound></NotFound>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
