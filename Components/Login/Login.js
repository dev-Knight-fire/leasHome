"use client";

import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/Contexts/AuthContext";
import { CiFacebook } from "react-icons/ci";
import Loader from "../Shared/Loader/Loader";
import { auth, googleProvider } from "@/Firebase/auth";
import { db } from "@/Firebase/firestore";
import { 
   signInWithEmailAndPassword, 
   signInWithPopup, 
   updateProfile,
   sendPasswordResetEmail 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [createUserEmail, setCreateUserEmail] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const currentUser = {
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      await updateProfile(user, currentUser);
      
      // Save user to Firestore if they don't exist
      await saveUserToFirestore(user.displayName, user.email, user.photoURL);
      
      setCreateUserEmail(user.email);
      
      router.push('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToFirestore = async (displayName, email, photoURL) => {
    try {
      const createdAt = new Date().toISOString();
      
      const userData = {
        name: displayName,
        email,
        role: "user",
        createdAt,
        img: photoURL,
        status: "pending"
      };

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Save to Firestore
        await setDoc(userDocRef, userData);

      }
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const handleEmailLogin = async (data) => {
    const { email, password } = data;

    try {
      setLoading(true);
      setError("");

      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log(user);

      
      router.push('/');
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = (event) => {
    const form = event.target;
    const email = form.value;
    setUserEmail(email);
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (!userEmail) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendPasswordResetEmail(auth, userEmail);
      
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20">
      {/* <h2 className='text-center text-3xl '>Welcome To Login Page</h2> */}
      <div className="w-full justify-around lg:flex my-auto">
        <div className=" text-xl text-center font-bold m-auto ">
          <img
            className="w-full "
            src="https://i.ibb.co/njKWbpV/hello-login.gif"
            alt=""
          />
        </div>

        <div className=" bg-red-5 md:px-10 px-4 py-4 my-8 lg:w-1/2">
          <h1 className="text-black text-5xl text-center font-bold mb-5 ">
            Login
          </h1>
          <form
            onSubmit={handleSubmit(handleEmailLogin)}
            className="flex flex-col gap-4"
          >
            <div>
              {/* Email */}
              <div className="relative w-full mb-6 group">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.email
                    ? "focus:border-red-500 border-red-500"
                    : "focus:border-secondary"
                    }`}
                  placeholder=" "
                  {...register("email", { required: true })}
                />

                <label
                  htmlFor="floating_email"
                  className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email
                </label>
                {errors.email && (
                  <span className="text-xs text-red-500">
                    This field is required
                  </span>
                )}
              </div>
            </div>
            <div>
              {/* password  */}
              <div className="relative w-full mb-6 group">
                <input
                  type="password"
                  name="floating_password"
                  id="floating_password"
                  className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.password
                    ? "focus:border-red-500 border-red-500"
                    : "focus:border-secondary"
                    }`}
                  placeholder=" "
                  {...register("password", { required: true })}
                />

                <label
                  htmlFor="floating_password"
                  className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Enter your password
                </label>
                {errors.password && (
                  <span className="text-xs text-red-500">
                    This field is required
                  </span>
                )}
              </div>
            </div>
            {/* Error show  */}
            <p className="text-red-500">{error}</p>

            <Button
              className={`lg:mx-auto w-full bg-secondary hover:bg-primary flex items-center justify-center${loading ? " disabled" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm mr-2 animate-spin inline-block w-4 h-4 border-2 border-t-2 border-t-white border-white rounded-full"
                  role="status"
                  aria-hidden="true"
                  style={{
                    borderTopColor: "white",
                    borderRightColor: "transparent",
                    borderBottomColor: "transparent",
                    borderLeftColor: "transparent",
                  }}
                ></span>
              )}
              Login
            </Button>
          </form>
          <p className="my-4">
            Forgot Password?
            <button
              onClick={handleForgotPassword}
              className=" underline text-blue-600 ml-1"
            >
              reset here.
            </button>
          </p>
          <p>
            Don't have an account?{" "}
            <Link className="text-blue-500 underline" href="/register">
              Register
            </Link>
          </p>
          <div className="flex justify-between  py-8">
            <div className="flex w-full">
              <div className="flex flex-col w-full border-opacity-50">
                <div className=""></div>
                <div className="divider text-xl font-bold text-black">
                  Or continue with
                </div>
                <div className="grid h-20 card  rounded-box place-items-center ">
                  <div className="flex gap-4 w-full">
                    <Button
                      outline={true}
                      className="hover:text-white text-3xl w-full bg-secondary"
                      onClick={handleGoogleSignIn}
                    >
                      <span className="flex items-center justify-center font-bold hover:text-white focus:text-white w-full">
                        <FcGoogle className="mr-2 text-xl" />
                        Google
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
