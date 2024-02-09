import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import '../../Styles/VolunteerRegForm.css';
import { ToastContainer, toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import NavBar from "../../Components/Navbar";

const VolunteerRegForm = () => {

    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");

    const [activityTitle, setActivityTitle] = useState("");
    const [activityDays, setActivityDays] = useState([]);
    const [activityTime, setActivityTime] = useState("");
    
    const [sessionDate, setSessionDate] = useState('');
    const [regForm, setRegForm] = useState('');
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]); // what the users chose for each qn

    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

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
            if (userId !== "") {
                try {
                    const res = await axios.get(`http://localhost:4000/activities/${id}`, { withCredentials: true });
                    // const selectedActivity = res.data.data.find(activity => activity._id === id);
                    const selectedActivity = res.data;
                    console.log(selectedActivity);
                    if (res) {
                        setActivityTitle(selectedActivity.title);
                        setActivityDays(selectedActivity.scheduleDays);
                        setActivityTime(selectedActivity.scheduleTime);
                        setRegForm(selectedActivity.registerForm);
                    } else {
                        console.error('Selected activity not found');
                    }
                    console.log(activityTitle + 'at' + activityTime);
                } catch (error) {
                    console.error('getActivity error:', error);
                }
            }
        }

        verifyCookie();
        getActivity();
      }, [cookies, navigate, removeCookie, role, username]);

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
            userId,
            sessionDate,
            choices
        };
        setLoading(true);

        try {
            if (sessionDate === "" || choices.length === 0) {
                setLoading(false);
                handleError('Please fill out all fields');
                return;
            }

            const res = await axios.post(`http://localhost:4000//register-form/:regFormId/:userId/`, data, { withCredentials: true });

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


    return (
        <div className="session_registration_page">
            <NavBar/>

            <div className="session_registration_header">
                <h1>Volunteer Registration</h1>
                <h2>You are registering for</h2>
                <h3>{activityTitle}</h3>
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
                                onChange={(date) => setSessionDate(dayjs(date).format('MM/DD/YYYY'))} 
                                minDate={dayjs('01/01/2024')} 
                                maxDate={dayjs('20/12/2024')}
                                sx={{bgcolor: '#C9E0E7', borderRadius: '5px'}}
                            />
                        </LocalizationProvider>
                    </div>

                    {questions.map((question, index) => (
  <FormControl key={index}>
    <InputLabel>{question.questionText}</InputLabel>
    <Select>
      {question.options.map((option, optionIndex) => (
        <MenuItem value={option.value} key={optionIndex}>
          {option.value}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
))}


                    {questions.map((question, index) => (
                        <div className="field_info_container">
                            <label htmlFor="title">{question[index].questionText}</label>
                            <FormControl>
                                <Select
                                    value={choices}
                                    label={question[index].questionText}
                                    onChange={(e) => setChoices(e.target.value)}
                                >
                                    {questions[index].options.map((option, num) => (
                                        <MenuItem value={option}>option </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    ))}
                        
                    <div className="field_info_container">
                        <label htmlFor="location">Preferred communication means</label>
                        <FormControl fullWidth>
                        <Select
                            id="demo-simple-select"
                            value={choices}
                            label="Preferred communiction means"
                            onChange={(e) => setChoices(e.target.value)}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                        </FormControl>
                    </div>

                    <div className="create_activity_buttons">
                        <button onClick={handleSubmit} className="save_button">Confirm registration</button>
                        <button onClick={handleCancel} className="cancel_button">Cancel</button>
                    </div>
                </div>
            )}

            <ToastContainer className="toast_container"/>
        </div>
    )
};

export default VolunteerRegForm