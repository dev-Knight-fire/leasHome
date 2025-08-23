import { FiFacebook, FiInstagram, FiLinkedin, FiPhoneCall, FiTwitter, FiYoutube } from 'react-icons/fi'
import { TfiEmail } from 'react-icons/tfi'
import { IoLocationOutline } from 'react-icons/io5'
import { IoIosArrowForward, IoIosArrowUp } from 'react-icons/io'
import { GrPinterest, GrSkype } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const Footer = () => {
   const [recentPosts, setRecentPosts] = useState([])

   // Date Formatter function 
   function formatDate(dateStr) {
      const date = new Date(dateStr);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return (date.toLocaleDateString('en-US', options))
   }

   // Fetch Recent Posts
   const pullJson = () => {
      fetch(`https://server-fare-bd.vercel.app/recent-post`)
         .then(res => res.json())
         .then(data => {
            setRecentPosts(data);

         })
   }
   // Use Effect for recent posts
   useEffect(() => {
      pullJson();
   }, [])

   // console.log(recentPosts);
   return (
      // Footer Section Added
      <footer className="bg-primary text-white">
         <div className='max-w-[1440px] w-[95%] mx-auto py-20'>
            <div className="grid grid-cols-1 md:grid-cols-4">
               <div>
                  <h2 className="mb-6 text-2xl font-semibold dark:text-white">Contact Us</h2>
                  <ul className="dark:text-gray-400">
                     <li>
                        <p className="flex items-center gap-2 mb-2"><FiPhoneCall />(+48)781909771</p>
                     </li>
                     <li>
                        <p className="flex items-center gap-2 mb-2"><TfiEmail />it4senior25@gmail.com</p>
                     </li>
                     <li>
                        <p className="flex items-center gap-2 mb-2"><IoLocationOutline />8 The Green Suite 8, Dover, 19901 Delaware, USA</p>
                     </li>
                  </ul>
               </div>
               <div>
                  <h2 className="mb-6 text-2xl font-semibold dark:text-white">Useful Links</h2>
                  <ul className="dark:text-gray-400">
                     <li>
                        <a href="/dashboard" className="hover:underline flex items-center "><IoIosArrowForward />Dashboard</a>
                     </li>
                     <li>
                        <a href="/properties" className="hover:underline flex items-center "><IoIosArrowForward />Properties</a>
                     </li>
                     <li>
                        <a href="/knowledge" className="hover:underline flex items-center"><IoIosArrowForward />Knowledge Base</a>
                     </li>
                     <li>
                        <a href="/terms" className="hover:underline flex items-center"><IoIosArrowForward />Terms of Use</a>
                     </li>
                  </ul>
               </div>
               <div>
                  <h2 className="mb-6 text-2xl font-semibold dark:text-white">Rent with us</h2>
                  <ul className="dark:text-gray-400">
                     <li>
                        <a href="#" className="hover:underline flex items-center"><IoIosArrowForward />Rent a House</a>
                     </li>
                     <li>
                        <a href="#" className="hover:underline flex items-center"><IoIosArrowForward />Book Now</a>
                     </li>
                     <li>
                        <a href="#" className="hover:underline flex items-center"><IoIosArrowForward />Book your Rooms</a>
                     </li>
                     <li>
                        <a href="#" className="hover:underline flex items-center"><IoIosArrowForward />Buy your Place</a>
                     </li>
                     <li>
                        <a href="#" className="hover:underline flex items-center"><IoIosArrowForward />Privacy Policy</a>
                     </li>
                  </ul>
               </div>
               <div>
                  <h2 className="mb-6 text-2xl font-semibold dark:text-white">Chat Room & Others</h2>
                  <ul className="dark:text-gray-400 items-center">
                     <li className="mb-4 hover:underline">
                        <Link href="/chat">
                           <div className='flex gap-4 items-center'>
                              <span className="w-10 h-10 flex items-center justify-center bg-secondary text-white rounded-md border text-xl font-bold">💬</span>
                              <div>
                                 <h4>Chat Room</h4>
                                 <p>Join our community chat</p>
                              </div>
                           </div>
                        </Link>
                     </li>
                     <li className="mb-4 hover:underline">
                        <Link href="/faq">
                           <div className='flex gap-4 items-center'>
                              <span className="w-10 h-10 flex items-center justify-center bg-secondary text-white rounded-md border text-xl font-bold">❓</span>
                              <div>
                                 <h4>FAQ</h4>
                                 <p>Frequently Asked Questions</p>
                              </div>
                           </div>
                        </Link>
                     </li>
                     <li className="mb-4 hover:underline">
                        <Link href="/support">
                           <div className='flex gap-4 items-center'>
                              <span className="w-10 h-10 flex items-center justify-center bg-secondary text-white rounded-md border text-xl font-bold">🛠️</span>
                              <div>
                                 <h4>Support</h4>
                                 <p>Contact our support team</p>
                              </div>
                           </div>
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="p-4 mt-20 rounded-lg shadow border md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 items-center">
               <span className="text-sm text-white sm:text-center dark:text-gray-400">Copyright by Confidence. All right Reserved © 2025
               </span>

               <ul className="flex flex-wrap items-center justify-center mt-3 text-3xl text-center text-white dark:text-gray-400 sm:mt-0 gap-4">
                  <li>
                     <a href="#" className="hover:underline"><FiFacebook className='border p-1 rounded-full' /></a>
                  </li>
                  <li>
                     <a href="#" className="hover:underline"><FiInstagram className='border p-1 rounded-full' /></a>
                  </li>
               </ul>
            </div>

         </div>
      </footer>
   );
};

export default Footer;