import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    contactnumber: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstname, lastname,email, age,contactnumber,password } = signupInfo;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !age ||
      !contactnumber ||
      !password
    ) {
      return handleError("Name, email, and password are required");
    }
    try {
      // Use env variable for API URL or hardcode if needed
      const url = `${
        process.env.REACT_APP_API_URL || "http://localhost:8080"
      }/auth/signup`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);

        const { firstname, lastname, email, age, contactnumber } = signupInfo;
        localStorage.setItem('userProfile', JSON.stringify({
          firstname,
          lastname,
          email,
          age,
          contactnumber
        }));

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || "Signup failed";
        handleError(details);
      } else {
        handleError(message || "Signup failed");
      }

      console.log(result);
    } catch (err) {
      handleError(err.message || err);
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="firstname"
            autoFocus
           
            value={signupInfo.firstname}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="lastname"
            autoFocus
           
            value={signupInfo.lastname}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            
            value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            onChange={handleChange}
            type="number"
            name="age"
            value={signupInfo.age}
          />
        </div>

        <div>
          <label htmlFor="contactnumber">Contact Number</label>
          <input
            onChange={handleChange}
            type="tel"
            name="contactnumber"
            value={signupInfo.contactnumber}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            
            value={signupInfo.password}
          />
        </div>
        <button type="submit">Signup</button>
        <span>
          Already have an account ?<Link to="/login">Login</Link>
        </span>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Signup;
