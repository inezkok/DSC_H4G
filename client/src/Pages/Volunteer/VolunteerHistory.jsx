import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHistory.css"
import { Box } from "@mui/material";
import VolunteerSessionFeedbackCard from "../../Components/VolunteerSessionFeedbackCard";
import { ToastContainer, toast } from "react-toastify";

const VolunteerHistory = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const [pastSessions, setPastSessions] = useState([]);
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

  // get past sessions
  useEffect(() => {
    if (loading && userId && userId !== "") {
      axios.get(`http://localhost:4000/session/volunteer/${userId}`, { withCredentials: true })
        .then((response) => {
          const oldSessions = response.data.data.filter((session) => new Date(session.sessionDate) < new Date());
          setPastSessions(oldSessions);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
          setLoading(false);
        });
      }
  }, [userId, loading, pastSessions]);

  const handleClickReview = (session, reviewedStatus) => {
    if (reviewedStatus) {
      toast("You have already reviewed this session", {
        position: "top-right",
        toastId: 'stop duplicate review'
      });
    } else {
      navigate(`/volunteer/feedback/${session._id}`);
    }
  }

  return (
    <>
      <div className="volunteer_history_page">
        <NavBar />

        <div className="volunteer_history_content">
          <h3>Your past volunteering sessions</h3>

          <Box className="sessions" sx={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', m: 2}}>
            {pastSessions
              .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
              .map((session, index) => (
                <VolunteerSessionFeedbackCard 
                  key={index} 
                  session={session} 
                  userId={userId} 
                  handleClickReview={handleClickReview}
                />
            ))}
          </Box>
        </div>
      </div>

      <ToastContainer />
    </>
  )
}

export default VolunteerHistory