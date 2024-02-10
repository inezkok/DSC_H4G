import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IconButton, Box } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminProgramTracker.css";
import AdminActivityCard from "../../Components/AdminActivityCard";
import AdminSessionCard from "../../Components/AdminSessionCard";

const AdminProgramTracker = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const [activities, setActivities] = useState([]);
  const [hasSessionTypeChange, setHasSessionTypeChange] = useState(false);
  const [sessionType, setSessionType] = useState("All");
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
      setRole(user.role);

      console.log(data);

      return status && user.role === "Admin"
        ? toast(`Hello ${user.username}`, {
            position: "top-right",
            toastId: 'stop welcome duplication'
          })
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username]);

  // get all activities
  useEffect(() => {
    console.log('Activities: ', activities);

    if (loading && username !== "") {
      axios.get(`http://localhost:4000/activities`, { withCredentials: true })
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
  }, [navigate, activities, loading, username,]);

  // get all sessions
  useEffect(() => {
    if (loading || hasSessionTypeChange) {
        axios.get(`http://localhost:4000/session`, { withCredentials: true })
            .then((response) => {
                console.log('Session Type: ', sessionType);
              
                if (response.data.success && response.data.data) {
                  if (sessionType === "Upcoming") {
                      setSessions(response.data.data.filter(session => new Date(session.sessionDate) >= new Date()));
                  } else if (sessionType === "Past") {
                      setSessions(response.data.data.filter(session => new Date(session.sessionDate) < new Date()));
                  } else {
                      setSessions(response.data.data);
                  }
                }

                console.log('Sessions: ', sessions);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(true);
                console.log("error");
            });
    }
  }, [loading, sessionType, hasSessionTypeChange]);

  const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      toastId: 'stop success duplication'
    });
  }

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
      toastId: 'stop error duplication'
    });
  }

  const handleEditActivity = (activity) => {
    navigate(`/admin/activities/${activity._id}/edit`);
  }

  const deleteActivity = async (activity) => {
    try {
      const res = await axios.delete(`http://localhost:4000/activities/${activity._id}`, { withCredentials: true });

      if (res.data.success) {
        window.location.reload();
        handleSuccess("Activity deleted successfully");
      } else {
        handleError("Error, failed to delete activity");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteActivity = (activity) => { 
    if (window.confirm(`Are you sure you want to delete ${activity.title}?`)) {
      deleteActivity(activity);
    }
  }

  const handleClickActivity = (activity) => {
    alert(`Navigate to registration form ${activity.registerForm}`);
  }

  const handleClickSession = (session) => {
    alert(`Navigate to feedback form ${session.feedbackForm}`);
  }

  const handleChange = (e) => {
    setSessionType(e.target.value);
    setHasSessionTypeChange(true);
  }

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <div className="admin_program_tracker">
        <NavBar />

        <div className="container">
            <div className="program_header">
              <h1>Sessions</h1>
            </div>

            <div className="session_filter_container">
              <label htmlFor="sessionType">Filter by:</label>
              <select id="sessionType" name="sessionType" value={sessionType} onChange={handleChange}>
                  <option value="All">All</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
              </select>
            </div>

            <Box className="programs">
              {sessions
                .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
                .map((session, index) => (
                    <AdminSessionCard 
                        key={session._id}
                        session={session}
                        handleClickSession = {handleClickSession}
                    />
                    ))
              }
            </Box>

            <div className="program_header">
              <h1>Programs</h1>

              <IconButton>
                  <Link to='/admin/activities/create'> 
                      <AddCircleIcon fontSize="large" sx={{color:"#000000"}} />
                  </Link>
              </IconButton>
            </div>

            <Box className="programs">
              {activities.map((activity, index) => (
                    <AdminActivityCard 
                        key={activity._id}
                        activity={activity}
                        handleDeleteActivity = {handleDeleteActivity}
                        handleEditActivity = {handleEditActivity}
                        handleClickActivity = {handleClickActivity}
                    />
                    ))
              }
            </Box>
        </div>
        
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminProgramTracker