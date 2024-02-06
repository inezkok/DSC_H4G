import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from "../Components/Navbar";
import useFetch from '../Hooks/useFetch';
import '../Styles/CreateActivity.css';
import { ToastContainer, toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const AdminCreateActivity = () => {

    const [email, setEmail] = useState("");
    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState("");
    
    const [title, setTitle] = useState('');
    const [schedule, setSchedule] = useState('');
    const [scheduleDay, setScheduleDay] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const navigate = useNavigate();
    const { data } = useFetch(`http://localhost:4000/api/users`);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    dayjs.extend(customParseFormat);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
              navigate("/login");
              return;
            }
            
            try {
                const res = await axios.post("http://localhost:4000", {}, { withCredentials: true });

                setEmail(res.data.email);

                if (!res.data.status) {
                  removeCookie("token");
                  navigate("/login");
                }
            } catch (error) {
                console.error('verifyCookie error:', error);
                navigate("/login");
            }
        };

        const getUser = () => {
            if (email !== "") {
                try {
                    if (data.data) {
                        setUserId(data.data.find(user => user.email === email)._id);
                    }
                } catch (error) {
                    console.error('getUser error:', error);
                }
            }
        }
          
        verifyCookie();
        getUser();
    }, [navigate, cookies, removeCookie, email, data, id, userId]);

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
        <div className="create_activity_page">
            <NavBar/>

            <div className="create_activity_header">
                <h1>Add an activity</h1>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="create_activity_form">
                    <div className="field_info_container">
                        <label htmlFor="title">Title</label>
                        <input type="text" placeholder={"Enter title"} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>


                    <div className="field_info_container">
                        <label htmlFor="schedule">Schedule</label>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={scheduleDay}
                                onChange={handleChangeDay}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {days.map((day) => (
                                  <MenuItem key={day} value={day}>
                                    <Checkbox checked={scheduleDay.indexOf(day) > -1} />
                                    <ListItemText primary={day} />
                                  </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <label htmlFor="schedule">Schedule</label>

                            <DatePicker 
                                label="Date" 
                                value={dayjs(date)} 
                                onChange={(date) => setDate(dayjs(date).format('DD/MM/YYYY'))} 
                                sx={{bgcolor: '#C9E0E7', borderRadius: '5px'}}
                            />
                        </LocalizationProvider>
                    </div>
                        
                    <div className="field_info_container">
                        <label htmlFor="location">Location</label>
                        <input type="text" placeholder={"Enter address"} value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="create_activity_buttons">
                        <button onClick={handleSave} className="save_button">Save</button>
                        <button onClick={handleCancel} className="cancel_button">Cancel</button>
                    </div>
                </div>
            )}

            <ToastContainer className="toast_container"/>
        </div>
    )
}

export default AdminCreateActivity;