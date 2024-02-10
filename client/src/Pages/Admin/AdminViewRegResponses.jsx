import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Box } from '@mui/material';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminProgramTracker.css";
import AdminResponseCard from "../../Components/AdminResponseCard";

const AdminViewRegResponses = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const { regFormId } = useParams(); // regformid
  const [activityTitle, setActivityTitle] = useState("");
  const [activityId, setActivityId] = useState('');
  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(false);

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

      return status && user.role === "Admin"
        ? (console.log('User is admin'))
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username, activityId, userId]);

  
  // get all responses
  useEffect(() => {
    console.log('Responses: ', responses);

    const getActivity = async () => {
        if (regFormId !== "") {
            try {
                const regForm = await axios.get(`http://localhost:4000/register-form/${regFormId}`, { withCredentials: true });
                console.log('description: ' + regForm.description);

                setActivityId(regForm.activityId);
                const activity = await axios.get(`http://localhost:4000/activities/${activityId}`, { withCredentials: true });
                setActivityTitle(activity.title);
            } catch (error) {
                console.error('getItinerary error:', error);
            }
        }
    }

    if (loading && regFormId !== "") {
      axios.get(`http://localhost:4000/response/register-form/${regFormId}`, { withCredentials: true })
        .then((res) => {
          setResponses(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(true);
          console.log("error");
        });
    }
    getActivity();
  }, [navigate, responses, loading, regFormId]);

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
      toastId: 'stop error duplication'
    });
  }

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <div className="admin_program_tracker">
        <NavBar />

        <div className="container">
            <div className="program_header">
              <h1>Responses</h1>
                <h2>{activityTitle}</h2>
            </div>

            <Box className="programs">
              {responses.map((response, index) => (
                    <AdminResponseCard 
                        key={response._id}
                        response={response}
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

export default AdminViewRegResponses