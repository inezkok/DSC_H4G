import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminHome.css";
import AdminCardComponent from "../../Components/AdminCard";
import StatsCardComponent from "../../Components/StatisticCard";
import { Container, tableSortLabelClasses } from "@mui/material"


const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [returningVolunteers, setReturningVolunteers] = useState(0);
  const [numSessions, setNumSessions] = useState(0); 

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

    const getVolunteersImpact = async() => {
      const {data} = await axios.get("http://localhost:4000/user/find/volunteer", {}, { withCredentials: true });
      if (data.success) {
        const allUsers = data.data;
        setTotalVolunteers(data.count);
        for (let i = 0; i < totalVolunteers; i++) {
          if (allUsers[i].sessions.length > 1) {
            setReturningVolunteers(returningVolunteers + 1);
          }
        }
      } else {
        toast("Error fetching volunteers", {
          position: "top-right",
        });
      }
    };

    const getTotalSessions = async() => {
      const {data} = await axios.get("http://localhost:4000/session/", {}, { withCredentials: true });
      if (data.success) {
        const allSessions = data.data;
        for (let i = 0; i < allSessions.length; i++) {
          if (allSessions[i].sessionDate < Date.now()) {
            setNumSessions(numSessions + 1);
          }
        }
      } else {
        toast("Error fetching sessions", {
          position: "top-right",
        });
      }
    };

    verifyCookie();
    getVolunteersImpact();
    getTotalSessions();

  }, [cookies, navigate, removeCookie, role, username]);

  return (
    <>
      <div className='admin_home_page'>
      <NavBar />
      <Container>
        <h5>Dashboard</h5>
        <AdminCardComponent title = {"Total Number of Volunteers"} count = {totalVolunteers}/>
        <AdminCardComponent title = {"Number of Returning Volunteers"} count = {returningVolunteers} />
        <AdminCardComponent title = {"Total number of Sessions"} count = {numSessions} />
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