"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import Loader from "../Shared/Loader/Loader";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/Firebase/auth";
import { db } from "@/Firebase/firestore";
import { storage } from "@/Firebase/storage";
import { 
   createUserWithEmailAndPassword, 
   updateProfile, 
   signInWithPopup 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Register = () => {

   const { user } = useAuth()
   const router = useRouter()

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset
   } = useForm();

   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [loginUserEmail, setLoginUserEmail] = useState('')
   const [createUserEmail, setCreateUserEmail] = useState('')
   const [termsAccepted, setTermsAccepted] = useState(false);

   const termsAndCondition = (event) => {
      setTermsAccepted(event.target.checked);
   };

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
         
         // Save user to Firestore
         await saveUserToFirestore(user.displayName, user.email, user.photoURL);
         
         setCreateUserEmail(user.email);
         
         router.push('/');
      } catch (error) {
         console.error(error);
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
            role: 'user', 
            createdAt, 
            img: photoURL 
         };

         // Save to Firestore
         await setDoc(doc(db, "users", email), userData);

      } catch (error) {
         console.error("Error saving user:", error);
         throw error;
      }
   };

   const uploadImageToFirebase = async (imageFile) => {
      try {
         const storageRef = ref(storage, `profile-images/${Date.now()}-${imageFile.name}`);
         const snapshot = await uploadBytes(storageRef, imageFile);
         const downloadURL = await getDownloadURL(snapshot.ref);
         return downloadURL;
      } catch (error) {
         console.error("Error uploading image:", error);
         throw error;
      }
   };

   const handleRegister = async (data) => {
      const {
         name,
         email,
         password,
         password2,
         photo,
         userType
      } = data;

      if (password !== password2) {
         setError('Passwords do not match');
         return;
      }

      setLoading(true);
      setError('');

      try {
         const image = photo[0];
         let imageURL = '';

         // Upload image to Firebase Storage
         if (image) {
            imageURL = await uploadImageToFirebase(image);
         }

         // Create user with email and password
         const result = await createUserWithEmailAndPassword(auth, email, password);
         const user = result.user;

         // Update user profile
         const currentUser = { 
            displayName: name, 
            photoURL: imageURL 
         };
         
         await updateProfile(user, currentUser);

         // Save user data to Firestore
         const insertUser = { 
            name: name, 
            email: email, 
            img: imageURL, 
            role: userType || 'user', 
            createdAt: new Date().toISOString() 
         };

         await setDoc(doc(db, "users", email), insertUser);

         setCreateUserEmail(email);
         
         reset();
         router.push('/');

      } catch (error) {
         console.error(error);
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };


   return (
      <div className="md:mx-6">
         <div className="w-full justify-around my-8 lg:flex">
            <div className="w-full text-center text-xl font-bold flex flex-col justify-center items-center">
               {/* <h2 className="text-2xl text-black my-auto">Welcome To Our Page</h2> */}
               <img
                  src="https://i.ibb.co/FDFvSHx/119048-login-verification.gif"
                  alt=""
               />
            </div>
            <div className=" bg-red-5 md:px-10 px-4 py-4 my-8 lg:w-4/5">
               <h1 className="text-black text-5xl font-bold mb-5 text-center ">Sign Up</h1>
               <form
                  onSubmit={handleSubmit(handleRegister)}
                  className="flex flex-col gap-4">
                  {/* name  */}
                  <div className="relative w-full mb-6 group">
                     <input
                        type="text"
                        name="floating_name"
                        id="floating_name"
                        className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.name
                           ? "focus:border-red-500 border-red-500"
                           : "focus:border-secondary"
                           }`}
                        placeholder=" "
                        {...register("name", { required: true })}
                     />

                     <label
                        htmlFor="floating_name"
                        className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                     >
                        Name
                     </label>
                     {errors.name && (
                        <span className="text-xs text-red-500">
                           This field is required
                        </span>
                     )}
                  </div>
                  {/* email  */}
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
                        Enter your email
                     </label>
                     {errors.email && (
                        <span className="text-xs text-red-500">
                           This field is required
                        </span>
                     )}
                  </div>
                  {/* photo */}
                  <div className="relative w-full mb-6 group">
                     <input
                        type="file"
                        name="floating_image"
                        id="floating_image"
                        className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.photo
                           ? "focus:border-red-500 border-red-500"
                           : "focus:border-secondary"
                           }`}
                        placeholder=" "
                        {...register("photo", { required: true })}
                     />

                     <label
                        htmlFor="floating_image"
                        className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                     >
                        Upload Profile Picture
                     </label>
                     {errors.photo && (
                        <span className="text-xs text-red-500">
                           This field is required
                        </span>
                     )}
                  </div>

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
                  {/* repeat password  */}
                  <div className="relative w-full mb-6 group">
                     <input
                        type="password"
                        name="floating_password2"
                        id="floating_password2"
                        className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.password2
                           ? "focus:border-red-500 border-red-500"
                           : "focus:border-secondary"
                           }`}
                        placeholder=" "
                        {...register("password2", { required: true })}
                     />

                     <label
                        htmlFor="floating_password2"
                        className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                     >
                        Re-enter your password
                     </label>
                     {errors.password2 && (
                        <span className="text-xs text-red-500">
                           This field is required
                        </span>
                     )}
                  </div>

                  {/* user type  */}
                  <div className="relative w-full mb-6 group">
                     <select
                        name="floating_userType"
                        id="floating_userType"
                        className={`block shadow-md shadow-primary/10 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-secondary focus:outline-none pl-2 focus:ring-0  peer ${errors.userType
                           ? "focus:border-red-500 border-red-500"
                           : "focus:border-secondary"
                           }`}
                        {...register("userType", { required: true })}
                     >
                        <option value="">Select user type</option>
                        <option value="user">User</option>
                        <option value="landlord">Landlord</option>
                        <option value="tenant">Tenant</option>
                     </select>

                     <label
                        htmlFor="floating_userType"
                        className="pl-2 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                     >
                        User Type
                     </label>
                     {errors.userType && (
                        <span className="text-xs text-red-500">
                           This field is required
                        </span>
                     )}
                  </div>

                  {/* Error show  */}
                  {error && <p className="text-red-500">
                     {error}
                  </p>}
                  {/* check box / mark  */}
                  <div className="flex items-center gap-2">
                     <Checkbox
                        onClick={termsAndCondition}
                        id="agree"
                        type="checkbox"
                     />
                     <Label htmlFor="agree">
                        I agree with the{" "}
                        <Link
                           href="/login"
                           className="text-blue-600 hover:underline dark:text-blue-500"
                        >
                           terms and conditions
                        </Link>
                     </Label>{" "}
                  </div>
                  <p className="flex items-center gap-2">
                     Already have an account?
                     <Link className="text-blue-500 underline" href="/login">
                        Login
                     </Link>
                  </p>
                  {/* {
                            loading ?
                                (
                                    <div className="text-center m-auto "> <Loading></Loading></div>
                                )
                                :
                                (
                                    <Button className="lg:w-1/2 lg:mx-auto" disabled={!termsAccepted} type="submit">
                                        Sign Up
                                    </Button>
                                )
                        } */}
                  <Button
                     className={`lg:mx-auto w-full bg-secondary hover:bg-primary flex items-center justify-center${loading ? " disabled" : ""}`}
                     disabled={!termsAccepted || loading}
                     type="submit"
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
                     Register
                  </Button>

                  <div className="flex justify-between  py-4">
                     <div className="flex w-full">
                        <div className="flex flex-col w-full border-opacity-50">
                           <div className="text-xs text-black text-center z-10 inline-block font-semibold">
                              Or Continue With
                           </div>
                           <hr className="border -mt-2" />
                           <div className="grid w-full card  rounded-box place-items-center pt-8">
                              <div className="flex gap-4 w-full">
                                 <Button
                                    outline={true}
                                    className={`hover:text-white text-3xl w-full bg-secondary d-flex align-items-center justify-content-center${loading ? " disabled" : ""}`}
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                 >
                                    <span className="flex items-center justify-center font-bold hover:text-white focus:text-white w-full">
                                       {loading && (
                                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                       )}
                                       <FcGoogle className="mr-2 text-xl" />
                                       Google
                                    </span>
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Register;