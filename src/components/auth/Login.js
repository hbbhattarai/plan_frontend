import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LogoImage from "../../assets/logo.png";
import PropTypes from 'prop-types';
import authService from "../../services/auth/auth.service";

const Login = () => {    // ({setToken}) inside login ()
  let navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleEmail = (e) => {
    setEmail(e.target.value);

  };

  const handlePassword = (e) => {
    setPassword(e.target.value)
  };

  const LoginForm = async (e) => {
    e.preventDefault();

    if (password !== undefined || email !== undefined) {
      if (email === "dhs@2022" && password === "dhs@2022") {
        toast.success('Login Successfull');
        return navigate('/dashboard')

      } else {
        toast.error('Opps ! Incorrect  Credintials Try Again')
      }

    } else {
      toast.error('Opps ! Please Fill All Details')
    }

  }
  return (
    <>
      <div className="flex font-serif items-center justify-center h-screen bg-no-repeat bg-cover">

        <div className="flex px-3  w-full md:w-1/4 flex-col items-center justify-center">
          <div className="flex flex-col bg-gray-100 shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
            <div className="flex flex-col justify-center items-center">
              <img src={LogoImage} className="h-28 w-auto mb-2" alt="DHS" />
              <h1 className="text-xl font-semibold">DHS | Plan Inventory System</h1>
            </div>
            <div className="mt-10">
              <form onSubmit={LoginForm}>
                <div className="flex flex-col mb-6">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>

                    <input type="email" onChange={handleEmail} value={email} className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="E-Mail Address" />
                  </div>
                </div>
                <div className="flex flex-col mb-6">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <span>
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                    </div>

                    <input type="password" onChange={handlePassword} value={password} className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Password" />
                  </div>
                </div>

                <div className="flex w-full">
                  <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded py-2 w-full transition duration-150 ease-in">
                    <span className="mr-2 uppercase">Login</span>
                    <span>
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer autoClose={3000}
          position="top-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />
      </div>

    </>

  )
}

export default Login // ({setToken})


Login.propTypes = {
  setToken: PropTypes.func.isRequired
}