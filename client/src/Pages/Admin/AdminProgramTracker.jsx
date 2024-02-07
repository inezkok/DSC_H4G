import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminProgramTracker.css";

const AdminProgramTracker = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }

      const {data} = await axios.post("http://localhost:4000", {}, { withCredentials: true });
      const {status, user} = data;

      if (!user) {
        removeCookie("token");
        navigate("/login");
        return;
      }

      setUsername(user.username);
      setRole(user.role);

      console.log(data);

      return status && user.role === "Admin"
        ? toast(`Hello ${user.username}`, {
            position: "top-right",
            toastId: 'stop welcome duplication'
          })
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username]);

  return (
    <>
      <div className="admin_program_tracker">
        <NavBar />
        <div className="container">
            <div className="section">
                <h1>Programs</h1>

            </div>
        
            <div className="section">
                <h1>Attendance</h1>

            </div>

        </div>
        
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminProgramTracker