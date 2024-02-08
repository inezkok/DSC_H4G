import { Route, Routes } from "react-router-dom";
import { Login, Signup, Landing, AdminHome, VolunteerHome, Profile } from "./Pages";
import AdminCreateActivity from "./Pages/Admin/AdminCreateActivity";
import AdminProgramTracker from "./Pages/Admin/AdminProgramTracker";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/programtracker" element={<AdminProgramTracker />} />
        <Route path="/admin/activities/create" element={<AdminCreateActivity />} />
        <Route path="/volunteer/home" element={<VolunteerHome />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
