import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../../Components/Navbar";
import "../../Styles/VolunteerHome.css"

const VolunteerFeedback = (session, activity) => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
  
    const [questions, setQuestions] = useState([
        "On a scale of 1 to 5, how much of an impact do you feel this volunteer work had on you.",
        "Explain your above answer."
    ]);

    useEffect(() => {
      const verifyCookie = async () => {
        if (!cookies.token) {
          navigate("/login");
        }
  
        const {data1} = await axios.post("http://localhost:4000", {}, { withCredentials: true });
        const {status, user} = data1;
  
        if (!user) {
          removeCookie("token");
          navigate("/login");
          return;
        }
  
        setUsername(user.username);
        setRole(user.role);
        setEmail(user.email);
  
        console.log(data);
  
        if (!status && user.role !== "Volunteer") {
            removeCookie("token"), navigate("/login");
        }

      };

    verifyCookie();

    }, [cookies, navigate, removeCookie, role, username, email, userId, sessions]);

    const handleSave = async () => {
        const data = {
            answers: [{
                questionId: questions[0],
                optionId: answer1
            }, {
                questionId: questions[1],
                optionId: answer2
            }]
        };

        try {
            if (answer1 === "" || answer2 === "") {
                handleError("Please fill out all fields");
                return;
            }

            const res = await axios.put(`http://localhost:4000/response/feedback-form/${id}`, { username, email }, { withCredentials: true });

            if (res.data.success) {
                handleSuccess("Feedback submitted successfully");
                setTimeout(() => {
                    navigate('/volunteer/home');
                }, 3000);
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }

        e.target.reset();
    }

    const handleCancel = () => {
        navigate('/volunteer/home');
    }

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "bottom-left",
            autoClose: 5000,
        });
    }

    const handleError = (err) => {
        toast.error(err, {
            position: "bottom-left",
        });
    }

    return (
        <>
          <div>
            <NavBar />
            <form onSubmit={handleSave} onReset={handleCancel}>
                    
                    <div>
                        <div>
                            <h1>Feedback Form</h1>
                            <h2>For {activity.title}, on {session.sessionDate} </h2>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="answer1">{questions[0]}</label> <br></br>
                                <select id="answer1" name="answer1" value={answer1} onChange={(e) => setAnswer1(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="answer2">{questions[1]}</label>
                                <input type="text" placeholder="input reason" value={answer2} onChange={(e) => setAnswer2(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button type="submit">Submit Feedback</button>
                            <button type="reset">Cancel</button>
                        </div>
                    </div>
                </form>
                <ToastContainer/>
          </div>
        </>
      )
    }
    
    export default VolunteerFeedback