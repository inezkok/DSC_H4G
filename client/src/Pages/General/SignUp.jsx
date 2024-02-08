import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
    howYouHeard: ""
  });
  
  const { email, username, password, role, howYouHeard } = inputValue;
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ 
      ...inputValue, 
      [name]: value 
    });
  };

  const handleError = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  }

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-left",
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "" || username === "" || password === "" || role === "") {
        handleError("Please fill in all fields!");
        return;
      }

      if (role === "Volunteer" && howYouHeard === "") {
        handleError("Please fill in how you know about GUI!");
        return;
      }

      const res = await axios.post("http://localhost:4000/signup", {
        ...inputValue,
      }, {
        withCredentials: true
      });
      
      if (res.data.success && res.data.user.role === "Admin") {
        handleSuccess(res.data.message);
        navigate("/admin/home");
      } else if (res.data.success && res.data.user.role === "Volunteer") {
        handleSuccess(res.data.message);
        navigate("/volunteer/home");
      } else {
        handleError(res.data.message);
      }

    } catch (err) {
      console.log(err);
    }

    setInputValue({
      ...inputValue,
      email: "",
      username: "",
      password: "",
      role: "",
      howYouHeard: ""
    });
  }

  return role === "Admin" || role === "" ?  (
    <div className="form_container">
      <h2>Signup Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" value={role} onChange={handleOnChange}>
          <option value="">Select Role</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <div> 
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>

        <button type="submit">Submit</button>

        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>

        <span>
          Return to <Link to={"/"}> Landing Page</Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  ) : (
    <div className="form_container">
      <h2>Signup Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" value={role} onChange={handleOnChange}>
          <option value="">Select Role</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="howYouHeard">How did you know about GUI?</label>
          <select name="howYouHeard" value={howYouHeard} onChange={handleOnChange}>
            <option value="">Select Method</option>
            <option value="GUI Website">GUI Website</option>
            <option value="Giving.sg">Giving.sg</option>
            <option value="GUI Facebook">GUI Facebook</option>
            <option value="GUI Instagram">GUI Instagram</option>
            <option value="GUI Telegram">GUI Telegram</option>
            <option value="GUI Electronic Direct Mail (EDM)">GUI Electronic Direct Mail (EDM)</option>
            <option value="MFS CS Placement">MFS CS Placement</option>
            <option value="Kins/Friends who experienced GUI">Kins/Friends who experienced GUI</option>
          </select>
        </div>
        
        <div> 
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>

        <button type="submit">Submit</button>

        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>

        <span>
          Return to <Link to={"/"}> Landing Page</Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  )
}

export default SignUp