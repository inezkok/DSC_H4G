import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import '../../Styles/VolunteerRegForm.css';
import { ToastContainer, toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import NavBar from "../../Components/Navbar";

const VolunteerRegForm = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");

    const { activityId } = useParams();
    const [activityTitle, setActivityTitle] = useState("");
    const [activitySchedule, setActivitySchedule] = useState([]);
    const [regFormId, setRegFormId] = useState('');
    
    const [questions, setQuestions] = useState([
        "Please indicate your preferred communication means.",
        "By filling up this form, you allow GUI to share your details with our supervisors and/or where needed, keep in contact, use your pictures for social media/website and you agree to indemnify GUI from being responsible for any injury or liability incurred during your stay at Kampung Kampus, home of GUI.",
        "Kampung lunch is available on Saturdays GBK. It is plant-based. A contribute-what-feels-right amount is encouraged to sustain the kitchen operation. Would you want to order lunch?"
    ]);

    const [sessionDate, setSessionDate] = useState("");
    const [inputValue, setInputValue] = useState({
        answer1: '',
        answer2: '',
        answer3: ''
    });
    
    const { answer1, answer2, answer3 } = inputValue;

    dayjs.extend(customParseFormat);

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

        const getActivity = async () => {
            if (userId !== "" && activityId !== "") {
                try {
                    const res = await axios.get(`http://localhost:4000/activities/${activityId}`, { withCredentials: true });
                    const selectedActivity = res.data.data;
                    console.log(selectedActivity);
                    if (res) {
                        setActivityTitle(selectedActivity.title);
                        setActivitySchedule(selectedActivity.scheduleDays);
                        setRegFormId(selectedActivity.registerForm);
                    } else {
                        console.error('Selected activity not found');
                    }
                } catch (error) {
                    console.error('getActivity error:', error);
                }
            }
        }

        verifyCookie();
        getActivity();
      }, [cookies, navigate, removeCookie, role, username, userId, activityId]);

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
            sessionDate,
            answers: [{
                questionId: questions[0],
                optionId: answer1
            }, {
                questionId: questions[1],
                optionId: answer2
            }, {
                questionId: questions[2],
                optionId: answer3
            }]
        };
        setLoading(true);

        try {
            if (sessionDate === "" || data.answers.length === 0 || data.answers[0].optionId === "" || data.answers[1].optionId === "" || data.answers[2].optionId === "") {
                setLoading(false);
                handleError('Please fill out all fields');
                return;
            }

            const res = await axios.post(`http://localhost:4000/response/register-form/${regFormId}/${userId}`, data, { withCredentials: true });

            if (res.data.success) {
                setLoading(false);
                handleSuccess('Your sign up is successful!');
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

    return (
        <div className="session_registration_page">
            <NavBar/>

            <div className="session_registration_header">
                <h1>Volunteer Registration</h1>
                <h3>You are registering for</h3>
                <h2>{activityTitle}</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="reg_form">
                    <div className="field_info_container">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DatePicker 
                                label="Session Date" 
                                value={dayjs(sessionDate)} 
                                onChange={(sessionDate) => setSessionDate(dayjs(sessionDate).format('MM/DD/YYYY'))} 
                                minDate={dayjs('01/01/2024')} 
                                maxDate={dayjs('20/12/2024')}
                                shouldDisableDate={(date) => {
                                    const dayOfWeek = dayjs(date).format('dddd');
                                    return !activitySchedule.includes(dayOfWeek);
                                }}
                                sx={{bgcolor: '#C9E0E7', borderRadius: '5px'}}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[0]}<span>*</span></h3>
                        <select id="answer1" name="answer1" value={answer1} onChange={handleOnChange}>
                            <option value="">Select preferred communication</option>
                            <option value="Telegram">Telegram</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>

                    <div className="field_info_container">
                        <h3>{questions[1]}<span>*</span></h3>
                        <select id="answer2" name="answer2" value={answer2} onChange={handleOnChange}>
                            <option value="">Select acknowlegment</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                        
                    <div className="field_info_container">
                        <h3>{questions[2]}<span>*</span></h3>
                        <select id="answer3" name="answer3" value={answer3} onChange={handleOnChange}>
                            <option value="">Select lunch arrangement</option>
                            <option value="Yes, please!">Yes, please!</option>
                            <option value="No, it's okay">No, it's okay</option>
                            <option value="Yes, but I have food allergies">Yes, but I have food allergies</option>
                        </select>
                    </div>

                    <div className="create_activity_buttons">
                        <button onClick={handleSubmit} className="save_button">Register</button>
                        <button onClick={handleCancel} className="cancel_button">Cancel</button>
                    </div>

                    <ToastContainer className="toast_container"/>
                </div>
            )}

            <ToastContainer className="toast_container"/>
        </div>  
    )
};

export default VolunteerRegForm