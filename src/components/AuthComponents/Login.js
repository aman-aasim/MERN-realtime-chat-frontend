import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import axios from "axios";
import iziToast from "izitoast";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import 'izitoast/dist/css/iziToast.min.css';

const Login = () => {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const { setLoggedInUser, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            navigate("/chatRoom");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const baseURL = process.env.REACT_APP_BASE_URL;
            const response = await axios.post(`${baseURL}/auth/login`, {
                mobile,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));

            setLoggedInUser(response.data.user);
            setIsAuthenticated(true);

            iziToast.success({
                title: "Success",
                message: "Login Successful!",
                position: "topRight",
            });

            navigate("/chatRoom");

        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Invalid credentials!";
            iziToast.error({
                title: "Error",
                message: errorMessage,
                position: "topRight",
            });
        }
    };


    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Sign in to your account</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
