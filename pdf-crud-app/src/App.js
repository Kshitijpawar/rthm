// import logo from './logo.svg';
import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import BlogDetails from "./BlogDetails";
import SetlistDetails from "./SetlistDetails";
import Create from "./Create";
import TestUpload from "./TestUpload";
import NotFound from "./NotFound";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  // const person = {};
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path= "/">
            <Home></Home>
            </Route>
            <Route path= "/create">
            <Create></Create>
            </Route>
            <Route path= "/blogs/:id">
            <BlogDetails></BlogDetails>
            </Route>
            <Route path= "/setlists/:id">
              <SetlistDetails></SetlistDetails>
            </Route>
            <Route path= "/testupload">
            <TestUpload></TestUpload>
            </Route>
            <Route path= "*">
              <NotFound></NotFound>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
