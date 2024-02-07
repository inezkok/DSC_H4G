import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import NavBar from '../../Components/Navbar';
import { ToastContainer, toast } from "react-toastify";
import '../../Styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();

    const [cookies, removeCookie] = useCookies([]);
    const [id, setId] = useState("");
    const [inputValue, setInputValue] = useState({
        email: "",
        mobile: "",
        telehandle: "",
        username: "",
        fullname: "",
        birthYear: "",
        gender: "",
        currentStatus: "",
        location: ""
    });

    const { email, mobile, telehandle, username, fullname, birthYear, gender, currentStatus, location } = inputValue;

    const [prevEmail, setPrevEmail] = useState("");
    const [prevMobile, setPrevMobile] = useState("");
    const [prevTelehandle, setPrevTelehandle] = useState("");
    const [prevUsername, setPrevUsername] = useState("");
    const [prevFullname, setPrevFullname] = useState("");
    const [prevBirthYear, setPrevBirthYear] = useState("");
    const [prevGender, setPrevGender] = useState("");
    const [prevCurrentStatus, setPrevCurrentStatus] = useState("");
    const [prevLocation, setPrevLocation] = useState("");

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
                return;
            }

            try {
                const { data } = await axios.post("http://localhost:4000", {}, { withCredentials: true });
                const { status, user } = data;

                if (!user || !status) {
                    removeCookie("token");
                    navigate("/login");
                    return;
                }

                setId(user._id);

                setPrevEmail(user.email);
                setPrevMobile(user.mobile);
                setPrevTelehandle(user.telehandle);
                setPrevUsername(user.username);
                setPrevFullname(user.fullname);
                setPrevBirthYear(user.birthYear);
                setPrevGender(user.gender);
                setPrevCurrentStatus(user.currentStatus);
                setPrevLocation(user.location);

                setInputValue({
                    email: user.email,
                    mobile: user.mobile,
                    telehandle: user.telehandle,
                    username: user.username,
                    fullname: user.fullname,
                    birthYear: user.birthYear,
                    gender: user.gender,
                    currentStatus: user.currentStatus,
                    location: user.location
                });
            } catch (error) {
                console.error(error);
                removeCookie("token");
                navigate("/login");
                return;
            }
        }
        verifyCookie();
    }, [cookies, navigate, removeCookie, id, prevEmail, prevMobile, prevTelehandle, prevUsername, prevFullname, prevBirthYear, prevGender, prevCurrentStatus, prevLocation]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setInputValue({
            ...inputValue,
            [name]: value
        });
    };

    const handleError = (error) => {
        toast.error(error, {
            position: "bottom-left"
        });
    };

    const handleSuccess = (message) => {
        toast.success(message, {
            position: "bottom-left",
            autoClose: 3000,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const data = {
            email,
            mobile,
            telehandle,
            username,
            fullname,
            birthYear,
            gender,
            currentStatus,
            location
        };

        try {
            if (email === "" || mobile === "" || username === "" || fullname === "" || birthYear === "" || gender === "" || currentStatus === "" || location === "") {
                handleError("Please fill in all required fields");
                return;
            }

            if (id !== "" && !id) {
                const res = await axios.put(`http://localhost:4000/user/${id}`, data, { withCredentials: true });
                if (res.data.success) {
                    handleSuccess("Profile updated successfully");
                    setTimeout(() => navigate(-1), 1000);
                }
            }
            const res = await axios.put(`http://localhost:4000/user/${id}`, data, { withCredentials: true });
            if (res.data.success) {
                handleSuccess("Profile updated successfully");
                setTimeout(() => navigate(-1), 1000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();

        setInputValue({
            email: prevEmail,
            mobile: prevMobile,
            telehandle: prevTelehandle,
            username: prevUsername,
            fullname: prevFullname,
            birthYear: prevBirthYear,
            gender: prevGender,
            currentStatus: prevCurrentStatus,
            location: prevLocation
        });

        navigate(-1);
    }

    const handleChangePassword = () => {
        alert("Change password clicked")
    }

    return (
        <>
            <div className="profile_page">
                <NavBar />

                <form onSubmit={handleSave} onReset={handleCancel}>
                    <div className="form-group">
                        <label htmlFor="email">Email<span>*</span></label>
                        <input type="email" placeholder={email} name="email" value={email} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobile">Mobile<span>*</span></label>
                        <input type="tel" placeholder={mobile} name="mobile" value={mobile} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Preferred Name<span>*</span></label>
                        <input type="text" placeholder={username} name="username" value={username} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullname">Full Name<span>*</span></label>
                        <input type="text" placeholder={fullname} name="fullname" value={fullname} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telehandle">Telegram Handle</label>
                        <input type="text" placeholder={telehandle} name="telehandle" value={telehandle} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthYear">Birth Year<span>*</span></label>
                        <input type="text" placeholder={birthYear} name="birthYear" value={birthYear} onChange={handleOnChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender<span>*</span></label>
                        <select id="gender" name="gender" value={gender} onChange={handleOnChange}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentStatus">Current Status<span>*</span></label>
                        <select id="currentStatus" name="currentStatus" value={currentStatus} onChange={handleOnChange}>
                            <option value="">Select Current Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="location">Residential Area<span>*</span></label>
                        <select id="location" name="location" value={location} onChange={handleOnChange}>
                            <option value="">Select Residential Area</option>
                            <option value="D1 - Raffles Place, Marina, Cecil">D1 - Raffles Place, Marina, Cecil</option>
                            <option value="D2 - Tanjong Pagar, Chinatown">D2 - Tanjong Pagar, Chinatown</option>
                            <option value="D3 - Tiong Bahru, Alexandra, Queenstown">D3 - Tiong Bahru, Alexandra, Queenstown</option>
                            <option value="D4 - Mount Faber, Telok Blangah, Harbourfront">D4 - Mount Faber, Telok Blangah, Harbourfront</option>
                            <option value="D5 - Buona Vista, Pasir Panjang, Clementi">D5 - Buona Vista, Pasir Panjang, Clementi</option>
                            <option value="D6 - Clarke Quay, City Hall">D6 - Clarke Quay, City Hall</option>
                            <option value="D7 - Bugis, Beach Road, Golden Mile">D7 - Bugis, Beach Road, Golden Mile</option>
                            <option value="D8 - Little India, Farrer Park">D8 - Little India, Farrer Park</option>
                            <option value="D9 - Orchard, River Valley">D9 - Orchard, River Valley</option>
                            <option value="D10 - Bukit Timah, Holland, Balmoral">D10 - Bukit Timah, Holland, Balmoral</option>
                            <option value="D11 - Novena, Newton, Thomson">D11 - Novena, Newton, Thomson</option>
                            <option value="D12 - Toa Payoh, Serangoon, Balestier">D12 - Toa Payoh, Serangoon, Balestier</option>
                            <option value="D13 - Macpherson, Braddell">D13 - Macpherson, Braddell</option>
                            <option value="D14 - Geylang, Paya Lebar, Sims">D14 - Geylang, Paya Lebar, Sims</option>
                            <option value="D15 - Joo Chiat, Marina Parade, Katong">D15 - Joo Chiat, Marina Parade, Katong</option>
                            <option value="D16 - Bedok, Upper East Coast, Siglap">D16 - Bedok, Upper East Coast, Siglap</option>
                            <option value="D17 - Changi, Flora, Loyang">D17 - Changi, Flora, Loyang</option>
                            <option value="D18 - Tampines, Pasir Ris">D18 - Tampines, Pasir Ris</option>
                            <option value="D19 - Punggol, Sengkang, Hougang, Serangoon Gardens">D19 - Punggol, Sengkang, Hougang, Serangoon Gardens</option>
                            <option value="D20 - Ang Mo Kio, Bishan, Thomson">D20 - Ang Mo Kio, Bishan, Thomson</option>
                            <option value="D21 - Upper Bukit Timah, Ulu Pandan, Clementi Park">D21 - Upper Bukit Timah, Ulu Pandan, Clementi Park</option>
                            <option value="D22 - Boon Lay, Jurong, Tuas">D22 - Boon Lay, Jurong, Tuas</option>
                            <option value="D23 - Choa Chu Kang, Diary Farm, Hillview, Bukit Panjang, Bukit Batok">D23 - Choa Chu Kang, Diary Farm, Hillview, Bukit Panjang, Bukit Batok</option>
                            <option value="D24 - Kranji, Lim Chu Kang, Tengah">D24 - Kranji, Lim Chu Kang, Tengah</option>
                            <option value="D25 - Woodlands, Admiralty">D25 - Woodlands, Admiralty</option>
                            <option value="D26 - Upper Thomson, Mandai">D26 - Upper Thomson, Mandai</option>
                            <option value="D27 - Sembawang, Yishun, Admiralty">D27 - Sembawang, Yishun, Admiralty</option>
                            <option value="D28 - Yio Chu Kang, Seletar">D28 - Yio Chu Kang, Seletar</option>
                        </select>
                    </div>

                    <div className="profile_buttons">
                        <button type="button" className='profile_password_button' onClick={handleChangePassword}>Change password?</button>
                        <button type="submit" className="profile_save_button">Save</button>
                        <button type="reset" className="profile_cancel_button">Cancel</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default Profile