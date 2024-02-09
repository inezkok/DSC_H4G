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
    const [role, setRole] = useState("");
    
    const [title, setTitle] = useState('');
    const [schedule, setSchedule] = useState('');
    const [scheduleDay, setScheduleDay] = useState([]);
    const [scheduleTimeStart, setScheduleTimeStart] = useState(dayjs('2022-04-17T15:30'))
    const [scheduleTimeEnd, setScheduleTimeEnd] = useState(dayjs('2022-04-17T15:30'))
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

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
    
          console.log(data);
    
          return status && user.role === "Volunteer"
            ? (console.log('Valid volunteer'))
            : (removeCookie("token"), navigate("/login"));
        };

        verifyCookie();
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

    const handleSave = async () => {
        const data = {
            title,
            schedule,
            date,
            location
        };
        setLoading(true);

        try {
            if (title === "") {
                setLoading(false);
                handleError('Please fill out all fields');
                return;
            }

            let schedule = `${scheduleDay} ${scheduleTimeStart.format('HH:mm')} - ${scheduleTimeEnd.format('HH:mm')}`;
            setSchedule(schedule);
            setDate('');

            const res = await axios.post(`http://localhost:4000/activities/`, data, { withCredentials: true });

            if (res.data.success) {
                setLoading(false);
                handleSuccess('Activity created successfully');
                setTimeout(() => {
                    navigate('/admin/home');
                }, 3000);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
        }
    };

    const handleChangeDay = (event) => {
        const {
          target: { value },
        } = event;
        setScheduleDay(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleCancel = () => {
        setLoading(false);
        navigate('/admin/home');
    };

    return (
        <div className="session_registration_page">
            <NavBar/>

            <div className="session_registration_header">
                <h1>Volunteer Registration</h1>
                <h2>You are registering for</h2>
                <h3>insert activity name</h3>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="reg_form">

                    <div className="field_info_container">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DatePicker 
                                label="Session Date" 
                                value={dayjs(date)} 
                                onChange={(date) => setDate(dayjs(date).format('MM/DD/YYYY'))} 
                                minDate={dayjs('01/01/2024')} 
                                maxDate={dayjs('20/12/2024')}
                                sx={{bgcolor: '#C9E0E7', borderRadius: '5px'}}
                            />
                        </LocalizationProvider>
                    </div>
                    
                    <div className="field_info_container">
                        <label htmlFor="title">Mobile number</label>
                        <input type="text" placeholder={"Enter mobile number"} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                        
                    <div className="field_info_container">
                        <label htmlFor="location">Preferred communication means</label>
                        <input type="text" placeholder={"Enter address"} value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="create_activity_buttons">
                        <button onClick={handleSave} className="save_button">Confirm registration</button>
                        <button onClick={handleCancel} className="cancel_button">Cancel</button>
                    </div>
                </div>
            )}

            <ToastContainer className="toast_container"/>
        </div>
    )
};

export default VolunteerRegForm