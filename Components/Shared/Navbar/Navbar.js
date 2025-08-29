import { Avatar } from "flowbite-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MessagesSquareIcon } from "lucide-react";
import { useAuth } from "@/Contexts/AuthContext";
import { auth } from "@/Firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { db } from '@/Firebase/firestore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // Fetch unread messages count
  useEffect(() => {
    if (!user?.email) {
      setUnreadCount(0);
      return;
    }

    const unreadMessagesQuery = query(
      collection(db, 'messages'),
      where('toEmail', '==', user.email),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(unreadMessagesQuery, (snapshot) => {
      setUnreadCount(snapshot.docs.length);
    });

    return unsubscribe;
  }, [user?.email]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="bg-primary sticky top-0 z-40 shadow-lg">
      <nav className="max-w-[1440px] w-[95%] mx-auto text-white px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/logo_leashome_white.png"
              className="h-10 mr-3"
              alt="leasHome Logo"
            />
            <span className="text-3xl font-bold">
              Leas<span className="text-secondary">Home</span>
            </span>
          </Link>

          {/* Desktop Menu Items */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-secondary transition-colors font-medium">
              Home
            </Link>
            <Link href="/properties" className="text-white hover:text-secondary transition-colors font-medium">
              Properties
            </Link>
            <Link href="/cooper" className="text-white hover:text-secondary transition-colors font-medium">
              Cooper Index
            </Link>
            <Link href="/knowledge" className="text-white hover:text-secondary transition-colors font-medium">
              Knowledge Base
            </Link>
            <Link href="/faq" className="text-white hover:text-secondary transition-colors font-medium">
              FAQ
            </Link>
            <Link href="/terms" className="text-white hover:text-secondary transition-colors font-medium">
              Terms of Use
            </Link>
            
            {/* Chat with unread count */}
            <Link href="/chat" className="relative text-white hover:text-secondary transition-colors">
              <MessagesSquareIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user?.email ? (
              <>
                <Link href="/userprofile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Avatar
                    img={user?.photoURL}
                    rounded={true}
                    className="border-2 border-white"
                  />
                  <span className="text-sm font-medium hidden xl:block">
                    {user?.displayName || user?.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-white border border-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo_leashome_white.png"
                className="h-8 mr-2"
                alt="leasHome Logo"
              />
              <span className="text-xl font-bold">
                Leas<span className="text-secondary">Home</span>
              </span>
            </Link>

            {/* Mobile Right Side */}
            <div className="flex items-center space-x-3">
              {/* Chat with unread count */}
              <Link href="/chat" className="relative text-white hover:text-secondary transition-colors">
                <MessagesSquareIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMenuClick}
                className="text-white hover:text-secondary transition-colors p-2"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="mt-4 pb-4 border-t border-white/20">
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="/" className="text-white hover:text-secondary transition-colors font-medium">
                  Home
                </Link>
                <Link href="/properties" className="text-white hover:text-secondary transition-colors font-medium">
                  Properties
                </Link>
                <Link href="/cooper" className="text-white hover:text-secondary transition-colors font-medium">
                  Cooper Index
                </Link>
                <Link href="/knowledge" className="text-white hover:text-secondary transition-colors font-medium">
                  Knowledge Base
                </Link>
                <Link href="/faq" className="text-white hover:text-secondary transition-colors font-medium">
                  FAQ
                </Link>
                <Link href="/terms" className="text-white hover:text-secondary transition-colors font-medium">
                  Terms of Use
                </Link>
                
                {/* Mobile Auth */}
                {user?.email ? (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                    <Link href="/userprofile" className="flex items-center space-x-3 text-white hover:text-secondary transition-colors">
                      <Avatar
                        img={user?.avatar}
                        rounded={true}
                        className="border-2 border-white"
                      />
                      <span className="font-medium">
                        {user?.displayName || user?.email}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                    <Link href="/login">
                      <button className="w-full text-white border border-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors text-left">
                        Login
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="w-full bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors text-left">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;