import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import '../../Styles/VolunteerRegForm.css';

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

const VolunteerFeedback = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cookies, removeCookie] = useCookies([]);

    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");
    
    const {sessionId} = useParams();
    const [session, setSession] = useState({});
    const [activity, setActivity] = useState({});
    const [feedbackFormId, setFeedbackFormId] = useState("");
  
    const [questions, setQuestions] = useState([
        "Rate how convenient was the sign up process. (Inconvenient 1 to Very Convenient 5)",
        "Rate how much of an impact do you feel the volunteer work had on you. (No impact 1 to Great impact 5)",
        "Rate how easy was it for you to get along with the others in the midst of your volunteer work. (Not easy 1 to Very easy 5)",
        "Rate what is your overall satisfaction on volunteer with GUI (Very dissatisfied 1 to Super satisfied)",
        "Rate how likely is it that you would recommend others to volunteer with GUI? (Very unlikely 1 to Extremely likely 5)",
        "What more can we do for you in strengthening GUI Volunteer Community?"
    ]);

    const [inputValue, setInputValue] = useState({
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        answer5: '',
        answer6: ''
    });

    const { answer1, answer2, answer3, answer4, answer5, answer6 } = inputValue;

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
            ? (console.log('Valid volunteer'))
            : (removeCookie("token"), navigate("/login"));
        };

        verifyCookie();
      }, [cookies, navigate, removeCookie, role, username, userId, loading]);

    useEffect(() => {
        const getSession = async () => {
            if (sessionId && sessionId !== "") {
                console.log('sessionId:', sessionId);

                try {
                    const res = await axios.get(`http://localhost:4000/session/${sessionId}`, { withCredentials: true });
                    const selectedSession = res.data.data;
                    console.log(selectedSession);
                    if (res.data.success && res.data.data) {
                        setSession(res.data.data);
                        setFeedbackFormId(res.data.data.feedbackForm);
                    } else {
                        console.error('Selected session not found');
                    }
                
                } catch (error) {
                    console.error('getSession error:', error);
                }
            }
        }

        const getActivity = async () => {
            if (session && session.activityId !== "") {
                try {
                    const res = await axios.get(`http://localhost:4000/activities/${session.activityId}`, { withCredentials: true });
                    const selectedActivity = res.data.data;
                    console.log(selectedActivity);
                    if (res.data.success && res.data.data) {
                        setActivity(res.data.data);
                    } else {
                        console.error('Selected activity not found');
                    }
                } catch (error) {
                    console.error('getActivity error:', error);
                }
            }
        }

        getSession();
        getActivity();
    }, [sessionId, session]);

      const handleError = (err) => {
        toast.error(err, {
            position: "bottom-left",
        });
    }

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "bottom-left",
            autoClose: 3000,
        });
    }

    const handleSubmit = async () => {
        const data = {
            answers: [{
                questionId: questions[0],
                optionId: answer1
            }, {
                questionId: questions[1],
                optionId: answer2
            }, {
                questionId: questions[2],
                optionId: answer3
            }, {
                questionId: questions[3],
                optionId: answer4
            }, {
                questionId: questions[4],
                optionId: answer5
            },{
                questionId: questions[5],
                optionId: answer6
            }]
        };
        setLoading(true);

        try {
            if (data.answers.length === 0 || data.answers[0].optionId === "" || data.answers[1].optionId === "" || data.answers[2].optionId === "" || 
            data.answers[3].optionId === "" || data.answers[4].optionId === "" || data.answers[5].optionId === "") {
                setLoading(false);
                handleError('Please fill out all fields');
                return;
            }

            const res = await axios.post(`http://localhost:4000/response/feedback-form/${feedbackFormId}/${userId}`, data, { withCredentials: true });

            if (res.data.success) {
                setLoading(false);
                handleSuccess('Your review is successful!');
                setTimeout(() => {
                    navigate('/volunteer/home');
                }, 3000);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        setLoading(false);
        navigate('/volunteer/home');
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setInputValue({
            ...inputValue,
            [name]: value
        });
    };

    return loading ? (
        <div>Loading...</div>
    ) : (
        <div className="session_registration_page">
            <NavBar/>

            <div className="session_registration_header">
                <h1>Volunteer Feedback</h1>
                <h3>You are reviewing for</h3>
                <h2>{activity.title}, {formatDate(session.sessionDate)}</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="reg_form">
                    <div className="field_info_container">
                        <h3>{questions[0]}<span>*</span></h3>
                        <select id="answer1" name="answer1" value={answer1} onChange={handleOnChange}>
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[1]}<span>*</span></h3>
                        <select id="answer2" name="answer2" value={answer2} onChange={handleOnChange}>
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                        
                    <div className="field_info_container">
                        <h3>{questions[2]}<span>*</span></h3>
                        <select id="answer3" name="answer3" value={answer3} onChange={handleOnChange}>
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[3]}<span>*</span></h3>
                        <select id="answer4" name="answer4" value={answer4} onChange={handleOnChange}>
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[4]}<span>*</span></h3>
                        <select id="answer5" name="answer5" value={answer5} onChange={handleOnChange}>
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[5]}<span>*</span></h3>
                        <select id="answer6" name="answer6" value={answer6} onChange={handleOnChange}>
                            <option value="">Select method</option>
                            <option value="Encourage interest groups">Encourage interest groups</option>
                            <option value="Provide learning opportunities">Provide learning opportunities</option>
                            <option value="Organise potluck sessions">Organise potluck sessions</option>
                            <option value="Send regular updates">Send regular updates</option>
                        </select>
                    </div>

                    <div className="create_activity_buttons">
                        <button onClick={handleSubmit} className="save_button">Submit</button>
                        <button onClick={handleCancel} className="cancel_button">Cancel</button>
                    </div>

                    <ToastContainer className="toast_container"/>
                </div>
            )}
            <ToastContainer className="toast_container"/>
        </div>
    )
}
    
export default VolunteerFeedback