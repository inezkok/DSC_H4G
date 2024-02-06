import { Route, Routes } from "react-router-dom";
import { Login, Signup, Landing, AdminHome, PatronHome } from "./Pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/patron/home" element={<PatronHome />} />
      </Routes>
    </div>
  );
}

export default App;
