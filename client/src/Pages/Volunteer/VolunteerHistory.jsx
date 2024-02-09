import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"
import ActivityCardComponent from "../../Components/ActivityCard";
import { Container } from "@mui/material";

const VolunteerHistory = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [sessions, setSessions] = useState([]);
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [pastSessions, setPastSessions] = useState([]);
  
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
        setEmail(user.email);
  
        console.log(data);
  
        if (!status && user.role !== "Volunteer") {
            removeCookie("token"), navigate("/login");
        }

      };
  
    const getUser = async () => {
        if (userId === "" && email !== "") {
            try {
                if (data.data) {
                    setUserId(await data.data.find(user => user.email === email)._id);
                }
            } catch (error) {
                console.error('getUser error:', error);
            }
        }
    }

    const {data} = await.get(`http://localhost:4000/session/volunteer/${userId}`, {}, { withCredentials: true });
    if (data.status) {
        setSessions(data.data); 
        for (let i = 0; i < sessions.length(); i++) {
            if (sessions[i].sessionDate < new Date()) {
                setPastSessions(pastSessions.push(sessions[i]));
            }
        }   
    }

    verifyCookie();
    getUser();

    }, [cookies, navigate, removeCookie, role, username, email, userId, sessions]);

    return (
        <>
          <div className="volunteer_home_page">
            <NavBar />
            <Container>
              Your past sessions:
            </Container>
            <Container>
            {pastSessions.map((pastSessions) => (
                <ActivityCardComponent 
                key={pastSessions._id}
                pastSessions={pastSessions}
                />
            ))}
            </Container>
          </div>
        </>
      )
    }
    
    export default VolunteerHistory