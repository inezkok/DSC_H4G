import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHistory.css"
import { Box } from "@mui/material";
import VolunteerInfoCard from "../../Components/VolunteerInfoCard";
import { ToastContainer, toast } from "react-toastify";

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

const AdminSessionCapacity = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  
  const {sessionId} = useParams();
  const [session, setSession] = useState({});
  const [activity, setActivity] = useState({});
  const [volunteers, setVolunteers] = useState([]);

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
      setUserId(user._id);

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

    // get session
    useEffect(() => {
        if (loading && sessionId) {
            axios.get(`http://localhost:4000/session/${sessionId}`)
                .then((response) => {
                    if (response.data.success && response.data.data) {
                        setSession(response.data.data);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(true);
                });
        }
    }, [sessionId, session, loading]);

    // get activity
    useEffect(() => {
        if (loading && session && session.activityId) {
            axios.get(`http://localhost:4000/activities/${session.activityId}`)
                .then((response) => {
                    if (response.data.success && response.data.data) {
                        setActivity(response.data.data);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(true);
                });
        }
    }, [session.activityId, activity, loading]);

    // get volunteers from session
    useEffect(() => {
        if (loading && sessionId) {
            axios.get(`http://localhost:4000/session/${sessionId}`)
                .then((response) => {
                    if (response.data.success && response.data.data) {
                        setVolunteers(response.data.data.volunteers);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                console.log(error);
                setLoading(true);
                });
        }
    }, [sessionId, volunteers, loading]);

  return (
    <>
      <div className="volunteer_history_page">
        <NavBar />

        <div className="volunteer_history_content">
          <h3>Volunteer List for {activity.title}, {formatDate(session.sessionDate)}</h3>

          <Box className="sessions" sx={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', m: 2}}>
            {volunteers
              .map((volunteerId, index) => (
                <VolunteerInfoCard 
                  key={index}  
                  userId={volunteerId} 
                />
            ))}
          </Box>
        </div>
      </div>

      <ToastContainer />
    </>
  )
}

export default AdminSessionCapacity