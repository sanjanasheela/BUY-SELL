import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
// import './css/login.css';


function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log("Token verification result:", data);
                if (data.valid) {
                    navigate('/home');
                } else {
                    localStorage.removeItem('token');
                }
            })
            .catch(err => {
                console.error("Token verification error:", err);
                localStorage.removeItem('token');
            });
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        if (!email || !password) {
            return handleError('Email and password are required');
        }

        try {
            const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/login`;
            console.log("Submitting login with:", loginInfo);
            console.log("Sending to URL:", url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();
            console.log("Login response:", result);

            const { success, message, jwtToken, name, error } = result;

            if (success) {
                handleSuccess(message || "Login successful");
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                console.log("storedtoke",jwtToken)
                console.log(email);
                const userInfoUrl = `http://localhost:8080/auth/user/${email}`;
                const userResponse = await fetch(userInfoUrl, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${jwtToken}` // assuming your API uses Bearer token for auth
                    }
                });
                const userResult = await userResponse.json();
                console.log("User info response:", userResult);
    
                if (userResult.success) {
                    // Store user info (without password) in localStorage
                    localStorage.setItem('userProfile', JSON.stringify(userResult.user));
                } else {
                    // Optional: handle failure to get user info gracefully
                    console.warn("Failed to fetch user info:", userResult.message);
                }
    
    
                // from here give a get req to get the last name and stuff
                navigate('/home');
            } else {
                const details = error?.details?.[0]?.message || message || "Login failed";
                handleError(details);
            }
        } catch (err) {
            console.error("Login error:", err);
            handleError(err.message || "Something went wrong during login");
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account?
                    <Link to="/signup"> Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;