import { Route, Routes } from "react-router-dom";
import { Login, Signup, Landing, AdminHome, UserHome } from "./Pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/user/home" element={<UserHome />} />
      </Routes>
    </div>
  );
}

export default App;
