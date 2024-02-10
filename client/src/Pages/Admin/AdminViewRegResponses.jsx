import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../../Components/Navbar";
import "../../Styles/AdminProgramTracker.css";

const AdminViewRegResponses = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const { activityId } = useParams();
  const [activityTitle, setActivityTitle] = useState("");
  const [regFormId, setRegFormId] = useState('');
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
  }, [cookies, navigate, removeCookie, role, username]);

  

    // get selected activity
    useEffect(() => {
    
        if (loading && username !== "") {
          axios.get(`http://localhost:4000/activities`, { withCredentials: true })
            .then((response) => {
              const selectedActivity = response.data.data.find(activity => activity._id === activityId);
              setActivityTitle(selectedActivity.title);
              setLoading(false);
              console.log(activityTitle);
            })
            .catch((error) => {
              console.log(error);
              setLoading(true);
              console.log("error");
            });
        }
      }, [navigate, loading, username, activityId,]);

  // get all responses
  useEffect(() => {
    console.log('Responses: ', responses);

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

            

            
        </div>
        
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminViewRegResponses