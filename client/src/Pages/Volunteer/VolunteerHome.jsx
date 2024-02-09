import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "@mui/material";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"
import VolunteerActivityCard from "../../Components/VolunteerActivityCard";
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

    const getSessions = async () => {
      if (loading && userId !== "") {
        axios.get(`http://localhost:4000/volunteer/${userId}`, { withCredentials: true })
            .then((response) => {
                setSessions(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(true);
                console.log("error");
            });
      }
    }

    verifyCookie();
    getSessions();
  }, [cookies, navigate, removeCookie, role, username]);

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
          <Box className="activities" sx={{display: 'flex', flexWrap: 'wrap', m: 2, width: "50rem"}}>
          {sessions.map((session, index) => (
              <VolunteerActivityCard 
                activity={session}
                key={session._id}
              />
          ))}
          </Box>
        </div>


          <h3>Sign up for more volunteering sessions </h3>
        <Box className="activities" sx={{display: 'flex', flexWrap: 'wrap', m: 2, width: "50rem"}}>
          {activities.map((activity, index) => (
            <Link to={`/volunteer/register/${activity._id}`} sx={{ textDecoration: 'none !important'}} key={activity._id} >
              <VolunteerActivityCard 
                activity={activity}
              />
            </Link>
            
          ))}
        </Box>
      </div>
      <ToastContainer />
    </>
  )
}

export default VolunteerHome