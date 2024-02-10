import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

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
  };

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-left",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "" || password === "") {
        handleError("Please fill in all fields!");
        return;
      }

      const res = await axios.post("http://localhost:4000/login", {
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
      password: "",
    });
  }

  return (
    <div className="form_container">
      <h2>Login Account</h2>

      <form onSubmit={handleSubmit}>
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
          Don't have an account? <Link to={"/signup"}>Signup</Link>
        </span>

        <span>
          Return to <Link to={"/"}> Landing Page</Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  )
}

export default Login