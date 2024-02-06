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
  });
  
  const { email, username, password, role } = inputValue;
  
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

      const res = await axios.post("http://localhost:4000/signup", {
        ...inputValue,
      }, {
        withCredentials: true
      });
      
      if (res.data.success && res.data.user.role === "admin") {
        handleSuccess(res.data.message);
        navigate("/admin/home");
      } else if (res.data.success && res.data.user.role === "user") {
        handleSuccess(res.data.message);
        navigate("/user/home");
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
    });
  }

  return (
    <div className="form_container">
      <h2>Signup Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" value={role} onChange={handleOnChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
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