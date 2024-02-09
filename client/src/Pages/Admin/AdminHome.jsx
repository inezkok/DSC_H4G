import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminHome.css";
import AdminCardComponent from "../../Components/AdminCard";
import StatsCardComponent from "../../Components/StatisticCard";
import { Container } from "@mui/material"


const AdminHome = () => {
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

    const ImpactTracker = async () => {
      const {newdata} = await axios.get("http://localhost:4000/impact/", {}, { withCredentials: true });
      console.log(newdata.data);
    }

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username]);



  return (
    <>
      <div className='admin_home_page'>
      <NavBar />
      <Container>
        <h5>Dashboard</h5>
        <AdminCardComponent />
        <AdminCardComponent />
        <AdminCardComponent />
        <AdminCardComponent />
        <AdminCardComponent />
      </Container>
      
      <Container>
        <StatsCardComponent/>
      </Container>
      </div>
      <ToastContainer />
    </>
  )
}


export default AdminHome