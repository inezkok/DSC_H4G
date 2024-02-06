import { Route, Routes } from "react-router-dom";
import { Login, Signup, Landing, AdminHome, UserHome } from "./Pages";
import { AdminCreateActivity } from "./Pages/Admin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/activities/create" element={<AdminCreateActivity />} />
        <Route path="/user/home" element={<UserHome />} />
      </Routes>
    </div>
  );
}

export default App;
