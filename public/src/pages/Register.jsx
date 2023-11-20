import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  });

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (username.length < 4) {
      toast.error("username should be greater than 3 characters", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be greater or equal to 8 characters",
        toastOptions
      );
      return false;
    } else if (password !== confirmPassword) {
      toast.error(
        "password and confirm password should be the same",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <Rotate>
              <img src={Logo} alt="logo" />
            </Rotate>
            <GradientText>iVRChat</GradientText>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <GradientButton type="submit">Create User</GradientButton>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const rotatey = keyframes`
  from {
    transform: rotatey(0deg);
  }

  to {
    transform: rotatey(360deg);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: scale(0.75);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const colorChangeAnimation = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`;

const GradientText = styled.div`
  background: linear-gradient(to right, #ff8a00, #e52e71);
  font-size: 45px;
  font-weight: bold;
  background: linear-gradient(to right, #00cc7a, #ffeb3b, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  animation: ${pulseAnimation} 3s ease-in-out infinite,
    ${colorChangeAnimation} 1s linear infinite;
  &:hover {
    animation: none;
  }
`;

const GradientButton = styled.button`
  background: linear-gradient(to right, #ff8a00, #e52e71);
  color: white;
  padding: 1rem 2rem;
  border: none;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition: background-color 0.1s ease;
  &:hover {
    background: linear-gradient(to right, #7928ca, #ff0080);
  }
`;

const Rotate = styled.div`
  transform-style: preserve-3d;
  transform-origin: bottom center;
  animation: ${rotatey} 5s linear infinite;
`;

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(to top right, #ff0066, #ff8a00, #e52e71);
  .brand {
    display: flex;
    align-items: center;
    ${"" /* gap: 1rem; */}
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #000000;
    border-radius: 2rem;
    padding: 3rem 4rem 3rem 4rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #e52e71;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: green;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: orange;
    }
  }
  span {
    color: white;
    a {
      color: #e52e71;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
