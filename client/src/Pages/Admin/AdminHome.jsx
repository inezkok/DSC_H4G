import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

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
        ? toast(`Hello ${user.username}`, {
            position: "top-right",
            toastId: 'stop welcome duplication'
          })
        : (removeCookie("token"), navigate("/login"));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie, role, username]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  }

  return (
    <>
      <div className="admin_home_page">
        <h1>Admin Home Page</h1>
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminHome