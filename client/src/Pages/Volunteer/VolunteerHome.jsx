import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"
import ActivityCardComponent from "../../Components/ActivityCard";
import { Container } from "@mui/material";


const VolunteerHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [sessions, setSessions] = useState("");
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
      setSessions(user.sessions);

      console.log(data);

      return status && user.role === "Volunteer"
        ? toast(`Hello ${user.username}`, {
            position: "top-right",
            toastId: 'stop welcome duplication'
          })
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username, sessions]);

  return (
    <>
      <div className="volunteer_home_page">
        <NavBar />
        <Container>
          Your upcoming session
        </Container>
        <Container>
          <ActivityCardComponent props={sessions[0]}/>
          <ActivityCardComponent props={sessions[1]}/>
          <ActivityCardComponent props={sessions[2]}/>
        </Container>
        <Container>
          Sign up for more volunteering sessions
        </Container>
        <Container>
          <ActivityCardComponent />
          <ActivityCardComponent />
          <ActivityCardComponent />
        </Container>
        <Container>
          <ActivityCardComponent />
          <ActivityCardComponent />
        </Container>
      </div>
      <ToastContainer />
    </>
  )
}

export default VolunteerHome