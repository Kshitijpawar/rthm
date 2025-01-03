import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import SetlistDetails from "./SetlistDetails";
import NotFound from "./NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SongDetails from "./SongDetails";
import SetlistEdit from "./SetlistEdit";
import CreateSetlist from "./CreateSetlist";
import AuthComp from "./AuthComp";
import ViewSetlists from "./ViewSetlists";
import ProtectedRoute from "./ProtectedRoute";
import PdfView from "./PdfView";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthComp />} />

            {/* Protected routes for nested paths */}
            <Route
              path="/setlists/:setlistId/songs/:songId"
              element={
                <ProtectedRoute>
                  <SongDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setlists/:setlistId/songs/:songId/:instrument/viewpdf"
              element={
                <ProtectedRoute>
                  <PdfView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setlists/:setlistId/edit"
              element={
                <ProtectedRoute>
                  <SetlistEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setlists/:id"
              element={
                <ProtectedRoute>
                  <SetlistDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setlists"
              element={
                <ProtectedRoute>
                  <ViewSetlists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createsetlist"
              element={
                <ProtectedRoute>
                  <CreateSetlist />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
