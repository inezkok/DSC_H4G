import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import '../../Styles/AdminCreateActivity.css';
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

const AdminEditActivity = () => {

    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    
    const [existingTitle, setExistingTitle] = useState('');
    const [existingScheduleDays, setExistingScheduleDays] = useState([]);
    const [existingScheduleTime, setExistingScheduleTime] = useState('');
    const [existingScheduleTimeStart, setExistingScheduleTimeStart] = useState(dayjs('2022-04-17T15:30'))
    const [existingScheduleTimeEnd, setExistingScheduleTimeEnd] = useState(dayjs('2022-04-17T15:30'))
    const [existingLocation, setExistingLocation] = useState('');
    const [existingCapacity, setExistingCapacity] = useState(0);
    
    const [title, setTitle] = useState('');
    const [scheduleDays, setScheduleDays] = useState([]);
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleTimeStart, setScheduleTimeStart] = useState(dayjs('2022-04-17T15:30'))
    const [scheduleTimeEnd, setScheduleTimeEnd] = useState(dayjs('2022-04-17T15:30'))
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState(0);

    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
      },
    };

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
    
          return status && user.role === "Admin"
          ? (console.log('user is admin'))
            : (removeCookie("token"), navigate("/login"));
        };

        const getActivity = async () => {
                try {
                    const res = await axios.get(`http://localhost:4000/activities/${id}`, { withCredentials: true });
                    console.log(res.data.data);
                    const selectedActivity = res.data.data;
                    if (selectedActivity) {
                        setExistingTitle(selectedActivity.title);
                        setExistingScheduleDays(selectedActivity.scheduleDays);
                        setExistingScheduleTime(selectedActivity.scheduleTime);
                        const [start, end] = existingScheduleTime.split('-').map(time => time.trim().replace(':', ''));
                        setExistingScheduleTimeStart(start);
                        setExistingScheduleTimeEnd(end);
                        setExistingLocation(selectedActivity.location);
                        setExistingCapacity(selectedActivity.capacity);

                        setTitle(existingTitle);
                        setScheduleDays(existingScheduleDays);
                        setScheduleTime(existingScheduleTime);
                        setScheduleTimeStart(existingScheduleTimeStart);
                        setScheduleTimeEnd(existingScheduleTimeEnd);
                        setLocation(existingLocation);
                        setCapacity(existingCapacity);
                    } else {
                        console.error('Selected activity not found');
                    }
                } catch (error) {
                    console.error('getActivity error:', error);
                }
        }

        verifyCookie();
        getActivity();

        console.log('activity title: ' + existingTitle);
        console.log('activity time: ' + existingScheduleTimeStart + " - " + existingScheduleTimeEnd);
        console.log('activity capacity: ' + existingCapacity);
      }, [cookies, navigate, removeCookie, role, username, id]);

    const handleError = (err) => {
        toast.error(err, {
            position: "bottom-left",
        });
    }

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "bottom-left",
            autoClose: 2000,
        });
    }

    const handleSave = async () => {
        setScheduleTime(dayjs(scheduleTimeStart).format('HH:mm') + " - " + dayjs(scheduleTimeEnd).format('HH:mm'));

        const data = {
            title,
            scheduleDays,
            scheduleTime,
            location,
            capacity
        };
        setLoading(true);

        try {
            if (title === "") {
                setLoading(false);
                handleError('Please fill out all fields');
                return;
            }

            console.log(data)

            const res = await axios.put(`http://localhost:4000/activities/${id}`, data, { withCredentials: true });

            if (res.data.success) {
                setLoading(false);
                handleSuccess('Activity edited successfully');
                setTimeout(() => {
                    navigate('/admin/programtracker');
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
        setScheduleDays(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleCancel = () => {
        setLoading(false);
        navigate('/admin/programtracker');
    };

    return (
        <div className="create_activity_page">
            <NavBar/>

            <div className="create_activity_header">
                <h1>Edit activity</h1>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="create_activity_form">
                    <div className="field_info_container">
                        <label htmlFor="title">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>


                    <div className="field_info_container">
                        <label htmlFor="schedule">Schedule</label>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Day</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={existingScheduleDays}
                                onChange={handleChangeDay}
                                input={<OutlinedInput label="Day" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {days.map((day) => (
                                  <MenuItem key={day} value={day}>
                                    <Checkbox checked={existingScheduleDays.indexOf(day) > -1} />
                                    <ListItemText primary={day} />
                                  </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <label htmlFor="schedule">Time</label>
                                <TimePicker
                                    label="Start"
                                    value={dayjs(existingScheduleTimeStart, 'HHmm')}
                                    onChange={(newValue) => {
                                        setScheduleTimeStart(newValue)
                                        setScheduleTime(newValue.format('HH:mm') + " - " + dayjs(existingScheduleTimeEnd).format('HH:mm'))
                                    }}
                                />
                                
                                <TimePicker
                                    label="End"
                                    value={dayjs(existingScheduleTimeEnd, 'HHmm')}
                                    onChange={(newValue) => {
                                        const newDayjsValue = dayjs(newValue);
                                        setScheduleTimeEnd(newDayjsValue)
                                        setScheduleTime(dayjs(existingScheduleTimeStart).format('HH:mm') + " - " + newDayjsValue.format('HH:mm'))
                                    }}
                                />
                        </LocalizationProvider>
                    </div>
                        
                    <div className="field_info_container">
                        <label htmlFor="location">Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="field_info_container">
                        <label htmlFor="capacity">Maximum Capacity for each Session</label>
                        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
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
};

export default AdminEditActivity