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
    const [pastSessions, setPastSessions] = useState([]);
    const {activities, setActivities} = useState([]);

    useEffect(() => {
      const verifyCookie = async () => {
        if (!cookies.token) {
          navigate("/login");
        }
  
        const {data1} = await axios.post("http://localhost:4000", {}, { withCredentials: true });
        const {status, user} = data1;
  
        if (!user) {
          removeCookie("token");
          navigate("/login");
          return;
        }
  
        setUsername(user.username);
        setRole(user.role);
        setEmail(user.email);
        setSessions(user.sessions);
  
        console.log(data);
  
        if (!status && user.role !== "Volunteer") {
            removeCookie("token"), navigate("/login");
        }

        for (let i = 0; i < sessions.length(); i++) {
            if (sessions[i].sessionDate < new Date()) {
                setPastSessions(pastSessions.push(sessions[i]));
            }
        }

        for (let j = 0; j < pastSessions.length(); j++) {
            const {data3} = await axios.get("http://localhost:4000/activities/" + pastSessions[j].activityId, {}, { withCredentials: true });
            if (data3.status) {
                setActivities(activities.push(data3.data));
            }
        }   
      };
  
    verifyCookie();

    }, [cookies, navigate, removeCookie, role, username, email, userId, sessions]);

    return (
        <>
          <div className="volunteer_home_page">
            <NavBar />
            <Container>
              Your past sessions:
            </Container>
            <Container>
            {(() => {
              for (let i = 0; i < pastSessions.length(); i++) {
                  <ActivityCardComponent 
                  key={pastSessions[i]._id}
                  pastSessions={pastSessions[i]}
                  activities = {activities[i]}
                  />
                }
              })()
            }
            </Container>
          </div>
        </>
      )
    }
    
    export default VolunteerHistory