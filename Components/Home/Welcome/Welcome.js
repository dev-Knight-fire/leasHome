// Anik Datta
import Link from "next/link";

const Welcome = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0D1741 60%, #5BA600 100%)",
      }}
    >
      {/* Animated background shapes */}
      <div
        className="absolute"
        style={{
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #5BA600 0%, #0D1741 80%)",
          opacity: 0.25,
          borderRadius: "50%",
          zIndex: 1,
          animation: "float 8s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "-120px",
          right: "-120px",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, #fff 0%, #5BA600 80%)",
          opacity: 0.15,
          borderRadius: "50%",
          zIndex: 1,
          animation: "float2 10s ease-in-out infinite alternate",
        }}
      />
      <div className="flex items-center justify-center min-h-screen relative z-20">
        <div className="w-full max-w-3xl flex items-center justify-center">
          <div
            className="shadow-lg rounded-3xl w-full min-h-[28rem] bg-opacity-85 relative overflow-hidden"
            style={{
              background: "rgba(13, 23, 65, 0.85)",
              color: "#fff",
            }}
          >
            <div className="flex flex-col justify-center h-full px-8 py-10">
              <div className="mb-4">
                <h1
                  className="text-4xl md:text-5xl font-bold uppercase text-center"
                  style={{
                    letterSpacing: "2px",
                    textShadow: "0 4px 24px #5BA60099",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Create a free account <br />
                  <span className="text-secondary">and manage your properties online</span>
                </h1>
              </div>
              <div className="text-center mb-3">
                <span
                  className="inline-block bg-secondary text-white text-lg px-6 py-2 rounded-full font-semibold shadow"
                  style={{
                    letterSpacing: "1px",
                    fontWeight: 600,
                    fontFamily: "Lobster, cursive",
                    boxShadow: "0 2px 12px #5BA60055",
                  }}
                >
                  LeasHome
                </span>
              </div>
              <div className="mx-auto max-w-xl">
                <p className="text-lg text-gray-100 mb-4" style={{ opacity: 0.92 }}>
                  Welcome to our property lease and rent website! We are thrilled to have you here and hope that you find our platform informative, user-friendly, and beneficial. Whether you are looking for your dream home, a new investment property, or a place to rent, we are confident that our website will provide you with an excellent selection of options to choose from. We look forward to helping you find your perfect property!
                </p>
              </div>
              <div className="text-center mt-3 group relative inline-block">
                <Link href="/about" passHref legacyBehavior>
                  <a
                    className="font-bold px-6 py-2 rounded-full shadow-sm inline-flex items-center text-base transition-all duration-200 bg-white/90 text-[#0D1741] border-none hover:bg-secondary hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    LEARN MORE
                  </a>
                </Link>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-1 pointer-events-none z-30 whitespace-nowrap">
                  Learn more about LeasHome
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(40px) scale(1.05);}
        }
        @keyframes float2 {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-30px) scale(1.08);}
        }
      `}</style>
    </div>
  );
};

export default Welcome;
