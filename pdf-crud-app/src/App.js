import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import SetlistDetails from "./SetlistDetails";
import TestUpload from "./TestUpload";
import NotFound from "./NotFound";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateSetlist from "./CreateSetlist";
import SongDetails from "./SongDetails";
import SetlistEdit from "./SetlistEdit";
import ReactFile from "./ReactFile";
import CreateSetlistNew from "./CreateSetlistNew";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>
            <Route path="/setlists/:setlistId/songs/:songId">
              <SongDetails></SongDetails>
            </Route>
            <Route path="/setlists/:setlistId/edit">
              <SetlistEdit></SetlistEdit>
            </Route>
            <Route path="/setlists/:id">
              <SetlistDetails></SetlistDetails>
            </Route>
            <Route path="/testupload">
              <TestUpload></TestUpload>
            </Route>
            <Route path="/createsetlist">
              <CreateSetlistNew></CreateSetlistNew>
            </Route>
            <Route path="/reactpdf">
              <ReactFile></ReactFile>
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
