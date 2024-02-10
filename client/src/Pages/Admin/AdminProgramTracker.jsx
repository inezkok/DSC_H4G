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

const AdminProgramTracker = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const [activities, setActivities] = useState([]);
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

  useEffect(() => {
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
  }, [navigate, activities, loading, username]);

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
    alert(`Click ${activity.title}`);
  }

  return (
    <>
      <div className="admin_program_tracker">
        <NavBar />

        <div className="container">
            <div className="program_header">
              <h1>Programs</h1>

              <IconButton>
                  <Link to='/admin/activities/create'> 
                      <AddCircleIcon fontSize="large" sx={{color:"#000000"}} />
                  </Link>
              </IconButton>
            </div>

            <Box className="programs" sx={{}}>
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