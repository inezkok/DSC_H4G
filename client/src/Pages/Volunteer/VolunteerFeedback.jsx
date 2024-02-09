import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"
import ActivityCardComponent from "../../Components/ActivityCard";
import { Container } from "@mui/material";

const VolunteerFeedback = (session) => {
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
            <form onSubmit={handleSave} onReset={handleCancel}>
                    
                    <div>
                        <div>
                            <h1>Feedback Form</h1>
                            <h2>For {session.title} </h2>
                        </div>

                        <div className="profile_body">
                            <div className="profile_info_container">
                                <label htmlFor="username">Username</label>
                                <input type="text" placeholder={username} value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="profile_info_container">
                                <label htmlFor="email">Email</label>
                                <input type="text" placeholder={email} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="profile_buttons">
                            <button type="button" className='profile_password_button' onClick={handleChangePassword}>Change password?</button>
                            <button type="submit" className="profile_save_button">Save Changes</button>
                            <button type="reset" className="profile_cancel_button">Cancel Changes</button>
                        </div>
                    </div>
                </form>
          </div>
        </>
      )
    }
    
    export default VolunteerFeedback