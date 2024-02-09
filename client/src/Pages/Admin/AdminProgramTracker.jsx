import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IconButton, Box } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminProgramTracker.css";
import AdminProgramCard from "../../Components/AdminProgramCard";

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
        ? (console.log("user is admin"))
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

const handleDeleteActivity = (activity) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
       deleteActivity(activity) 
   } 
}

const deleteActivity = async (activity) => {
   try {
       const res = await axios.delete(`http://localhost:4000/activities/${activity._id}`, { withCredentials: true });
       if (res.data.success) {
           window.location.reload();
       } else {
           handleError("Error, activity unable to be deleted!");
       }
   } catch (error) {
       console.log(error);
   }
}

const handleError = (err) => {
    toast.error(err, {
        position: "bottom-left",
    });
}

  return (
    <>
      <div className="admin_program_tracker">
        <NavBar />
        <div className="container">
            <h1>Programs</h1>

            <IconButton>
                <Link to='/admin/activities/create'> 
                    <AddCircleIcon fontSize="large" sx={{color:"#000000"}} />
                </Link>
            </IconButton>

            
        </div>

        <Box className="programs" sx={{m: 2, width: "50rem"}}>
            {activities.map((activity, index) => (
                <AdminProgramCard 
                    key={activity._id}
                    activity={activity}
                    handleDeleteActivity = {handleDeleteActivity}
                />
                ))}
        </Box>
        
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminProgramTracker