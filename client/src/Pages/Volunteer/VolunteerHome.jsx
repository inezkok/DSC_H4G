import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "@mui/material";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"
import VolunteerActivityCard from "../../Components/VolunteerActivityCard";
import VolunteerSessionCard from "../../Components/VolunteerSessionCard";
import { Container } from "@mui/material";


const VolunteerHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setUserId(user._id);
      setRole(user.role);

      console.log(data);

      return status && user.role === "Volunteer"
        ? toast(`Hello ${user.username}`, {
            position: "top-right",
            toastId: 'stop welcome duplication'
          })
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username]);

  // get all sessions for the volunteer
  useEffect(() => {
    if (loading && username !== "") {
        axios.get(`http://localhost:4000/session/volunteer/${userId}`, { withCredentials: true })
            .then((response) => {
                const upcomingSessions = response.data.data.filter((session) => new Date(session.sessionDate) > new Date());
                setSessions(upcomingSessions);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(true);
                console.log("error");
            });
    }
  }, [username, userId, navigate, sessions, loading]);

  // get all activities avail for volunteering
  useEffect(() => {
    if (loading && username !== "") {
        axios.get(`http://localhost:4000/activities/`, { withCredentials: true })
            .then((response) => {
                setActivities(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(true);
                console.log("error");
            });
    }
}, [username, navigate, activities, loading]);

  return (
    <>
      <div className="volunteer_home_page">
        <NavBar />

        <div className="header">
          <h3>Your upcoming sessions </h3>
          <Box className="activities" sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', m: 2}}>
            {sessions
              .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
              .map((session, index) => (
                <VolunteerSessionCard
                  session={session}
                  key={index}
                />
            ))}
          </Box>
        </div>


          <h3>Sign up for more volunteering sessions </h3>
        <Box className="activities" sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', m: 2}}>
          {activities.map((activity, index) => (
              <VolunteerActivityCard 
                activity={activity}
                handleClickActivity={activity => navigate(`/volunteer/register/${activity._id}`)}
              />
          ))}
        </Box>
      </div>
      <ToastContainer />
    </>
  )
}

export default VolunteerHome