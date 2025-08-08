import React, { useState } from "react";
import {
  FaHouseUser,
  FaBuilding,
  FaClock,
  FaCartPlus,
  FaBriefcase,
  FaBookOpen,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaBookmark,
} from "react-icons/fa";

const legalGuides = [
  {
    title: "Understanding Lease Agreements",
    desc: "A comprehensive guide to the essentials of lease contracts, including rights, obligations, and key clauses.",
    link: "#",
  },
  {
    title: "Rental vs. Lease: Key Differences",
    desc: "Learn the legal and practical differences between standard rentals, leases, and long-term rental agreements.",
    link: "#",
  },
  {
    title: "Long-Term Rental: What to Know",
    desc: "Explore the unique aspects of long-term rental deals (5+ years), including legal protections and risks.",
    link: "#",
  },
  {
    title: "Purchase Options in Lease Deals",
    desc: "How purchase options work in lease agreements and what to consider before signing.",
    link: "#",
  },
  {
    title: "Investor & Leasing Company Guide",
    desc: "Legal and strategic considerations for investors and leasing companies entering property deals.",
    link: "#",
  },
];

const templates = [
  {
    title: "Standard Lease Agreement",
    desc: "A ready-to-use template for property lease deals.",
    link: "#",
  },
  {
    title: "Rental Agreement Template",
    desc: "Template for short-term and month-to-month rental arrangements.",
    link: "#",
  },
  {
    title: "Long-Term Rental Contract",
    desc: "Template for rentals of 5+ years, including special clauses.",
    link: "#",
  },
  {
    title: "Lease with Purchase Option",
    desc: "Template for lease agreements that include a purchase option.",
    link: "#",
  },
];

const leaseTypes = [
  {
    type: "Lease",
    duration: "Typically 1+ years",
    features: [
      "Fixed term",
      "Stable rent",
      "Tenant & landlord obligations set",
      "Early termination penalties",
    ],
    badge: "primary",
  },
  {
    type: "Rental",
    duration: "Short-term or month-to-month",
    features: [
      "Flexible term",
      "Easier termination",
      "Rent may change with notice",
      "Less security for tenant",
    ],
    badge: "success",
  },
  {
    type: "Long-term Rental",
    duration: "5+ years",
    features: [
      "Extended stability",
      "Custom clauses",
      "Potential for purchase option",
      "Often for businesses or investors",
    ],
    badge: "danger",
  },
];

const offerCategories = [
  {
    name: "Property Leasing",
    icon: <FaHouseUser className="text-blue-600" size={32} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Residential and commercial property leasing solutions.",
  },
  {
    name: "Land and Building Lease",
    icon: <FaBuilding className="text-sky-500" size={32} />,
    color: "text-sky-500",
    bg: "bg-sky-50",
    desc: "Lease land, buildings, or both for various purposes.",
  },
  {
    name: "Long-term Rental (5+ years)",
    icon: <FaClock className="text-amber-500" size={32} />,
    color: "text-amber-500",
    bg: "bg-amber-50",
    desc: "Secure long-term rental deals for stability and growth.",
  },
  {
    name: "With Purchase Option",
    icon: <FaCartPlus className="text-green-600" size={32} />,
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Lease agreements that allow you to buy the property later.",
  },
  {
    name: "For Investors & Leasing Companies",
    icon: <FaBriefcase className="text-slate-500" size={32} />,
    color: "text-slate-500",
    bg: "bg-slate-100",
    desc: "Specialized deals and templates for professionals.",
  },
];

const badgeColor = {
  primary: "bg-blue-600",
  success: "bg-green-600",
  danger: "bg-red-600",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Knowledge = () => {
  const [openGuide, setOpenGuide] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-teal-50 pt-0">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="font-extrabold mb-2 flex items-center justify-center"
            style={{
              fontSize: "2.7rem",
              color: "#2563eb",
              letterSpacing: "0.01em",
              textShadow: "0 2px 12px #c7d2fe",
            }}
          >
            <FaBookmark className="text-blue-500 mr-3" size={36} />
            Knowledge Base
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Legal guides, contract templates, and expert comparisons for all types of property deals.
          </p>
        </div>

        {/* Offer Categories */}
        <section className="mb-12">
          <h2 className="font-bold text-center mb-8 text-2xl text-slate-800">
            Offer Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
            {offerCategories.map((cat) => (
              <div key={cat.name} className="flex flex-col h-full">
                <div
                  className="flex flex-col h-full rounded-3xl bg-white shadow-lg transition-transform"
                >
                  <div
                    className={classNames(
                      "flex items-center justify-center mx-auto mt-6 mb-4 shadow",
                      "rounded-full",
                      cat.bg
                    )}
                    style={{ width: 70, height: 70 }}
                  >
                    {cat.icon}
                  </div>
                  <div className="text-center px-4 pb-6 flex-grow flex flex-col">
                    <div className="font-bold mb-1 text-[1.15rem]">{cat.name}</div>
                    <div className="text-slate-500 text-[0.98rem]">{cat.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lease Types Comparison */}
        <section className="mb-12">
          <h2 className="font-bold text-center mb-8 text-2xl text-slate-800">
            Comparison of Lease Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaseTypes.map((lt) => (
              <div key={lt.type} className="flex flex-col h-full">
                <div className="flex flex-col h-full rounded-3xl bg-slate-50 shadow-lg transition-transform">
                  <div className="px-6 py-6 flex-grow flex flex-col">
                    <span
                      className={classNames(
                        "mb-2 px-4 py-2 rounded-full font-semibold inline-block text-white text-[0.95rem] tracking-wide",
                        badgeColor[lt.badge]
                      )}
                    >
                      {lt.type}
                    </span>
                    <div className="text-slate-500 mb-3 text-[0.98rem]">{lt.duration}</div>
                    <ul className="mb-0">
                      {lt.features.map((f, i) => (
                        <li key={i} className="flex items-center mb-2 text-slate-700">
                          <FaCheckCircle className="text-green-500 mr-2" size={18} />
                          <span className="text-[0.98rem]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Guides & Templates */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Legal Guides */}
            <div>
              <h2 className="font-bold mb-6 flex items-center text-slate-800 text-[1.5rem]">
                <FaBookOpen className="text-blue-600 mr-2" size={24} />
                Legal Guides
              </h2>
              <div>
                {legalGuides.map((guide, idx) => (
                  <div
                    key={guide.title}
                    className="mb-4 rounded-2xl overflow-hidden border-none shadow-lg bg-white"
                  >
                    <button
                      type="button"
                      className={classNames(
                        "w-full text-left px-6 py-4 font-semibold border-0 bg-white flex items-center justify-between"
                      )}
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "1.05rem",
                        cursor: "pointer",
                        outline: "none",
                        borderBottom: openGuide === idx ? "1px solid #e0e7ff" : "none",
                        background: "#fff",
                      }}
                      aria-expanded={openGuide === idx}
                      onClick={() => setOpenGuide(openGuide === idx ? -1 : idx)}
                    >
                      <span>{guide.title}</span>
                      {openGuide === idx ? (
                        <FaChevronUp className="ml-2 text-slate-500" size={18} />
                      ) : (
                        <FaChevronDown className="ml-2 text-slate-500" size={18} />
                      )}
                    </button>
                    <div
                      className={classNames(
                        "transition-all duration-300 ease-in-out overflow-hidden",
                        openGuide === idx ? "max-h-60 opacity-100 py-4 px-6 pointer-events-auto" : "max-h-0 opacity-0 py-0 px-6 pointer-events-none"
                      )}
                      style={{
                        background: "#f8fafc",
                      }}
                    >
                      <p className="mb-2 text-slate-600">{guide.desc}</p>
                      <button
                        className="rounded-full border border-blue-600 text-blue-600 px-5 py-1 text-[0.95rem] font-medium opacity-60 bg-transparent pointer-events-none"
                        disabled
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Templates */}
            <div>
              <h2 className="font-bold mb-6 flex items-center text-slate-800 text-[1.5rem]">
                <FaFileAlt className="text-green-600 mr-2" size={24} />
                Contract Templates
              </h2>
              <div>
                {templates.map((tpl) => (
                  <div
                    key={tpl.title}
                    className="mb-4 rounded-2xl border-none shadow bg-white"
                  >
                    <div className="px-6 py-4">
                      <div className="font-semibold mb-1 text-[1.08rem]">
                        {tpl.title}
                      </div>
                      <div className="text-slate-500 mb-3 text-[0.97rem]">
                        {tpl.desc}
                      </div>
                      <button
                        className="rounded-full bg-green-600 text-white px-5 py-1 text-[0.95rem] font-medium opacity-60 pointer-events-none"
                        disabled
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="text-center text-slate-500 py-6 text-[0.98rem] bg-slate-100">
        <small>
          &copy; {new Date().getFullYear()} Cooper Calculator Knowledge Base. For informational purposes only.
        </small>
      </footer>
    </div>
  );
};

export default Knowledge;
