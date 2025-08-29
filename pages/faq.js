import React, { useState } from "react";
import Link from "next/link";
import {
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaCalculator,
  FaBookOpen,
  FaUserCircle,
} from "react-icons/fa";

const faqs = [
  {
    question: "What is Leas Home?",
    answer: (
      <>
        Leas Home is a modern platform for property leasing, land lease, and long-term rentals. We connect property owners and seekers, offering transparent deals, unique credit scoring (Cooper Index), and a knowledge base for safe, informed transactions.
      </>
    ),
  },
  {
    question: "How does the Cooper Calculator work?",
    answer: (
      <>
        The Cooper Calculator is a points-based tool that helps you assess your eligibility for a lease or rental—without checking BIK. Answer a few questions and get an instant, objective score.{" "}
        <Link href="/cooper" className="text-blue-600 underline hover:text-blue-800">
          Try it now!
        </Link>
      </>
    ),
  },
  {
    question: "What types of deals can I find?",
    answer: (
      <>
        <ul className="list-disc list-inside pl-4">
          <li>Standard property leasing</li>
          <li>Land and building lease</li>
          <li>Long-term rental (5+ years)</li>
          <li>Lease with purchase option</li>
          <li>Special offers for investors and leasing companies</li>
        </ul>
      </>
    ),
  },
  {
    question: "Is it safe to use Leas Home?",
    answer: (
      <>
        Yes! We prioritize transparency and safety. Our platform provides clear contract templates, a knowledge base, and a unique scoring system to help both parties make informed decisions.
      </>
    ),
  },
  {
    question: "How do I add my property listing?",
    answer: (
      <>
        Simply{" "}
        <Link href="/account" className="text-blue-600 underline hover:text-blue-800">
          create a free account
        </Link>
        , then click “Add your listing” on the homepage or in your profile dashboard. Fill in the details and publish—it's that easy!
      </>
    ),
  },
  {
    question: "Can I buy a property through Leas Home?",
    answer: (
      <>
        Many long-term rental and lease offers include a purchase option. Look for listings marked “With purchase option” or use the search filter to find them.
      </>
    ),
  },
  {
    question: "Where can I find legal guides and contract templates?",
    answer: (
      <>
        Visit our{" "}
        <Link href="/knowledge" className="text-blue-600 underline hover:text-blue-800">
          Knowledge Base
        </Link>{" "}
        for expert guides, contract templates, and comparisons of lease types.
      </>
    ),
  },
  {
    question: "How do I contact another user?",
    answer: (
      <>
        After creating an account, you can message other users directly through our secure internal messenger.
      </>
    ),
  },
  {
    question: "Is Leas Home free to use?",
    answer: (
      <>
        Yes! Browsing, listing, and using our knowledge base are all free. Advanced features for professionals may be added in the future.
      </>
    ),
  },
];

const FaqPage = () => {
  const [activeKey, setActiveKey] = useState(0);

  const handleToggle = (idx) => {
    setActiveKey(activeKey === idx ? -1 : idx);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="text-center mb-8">
          <FaQuestionCircle size={48} className="text-blue-600 mb-2 mx-auto" />
          <h1 className="font-extrabold text-4xl md:text-5xl mb-2 text-blue-800 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Everything you need to know about leasing, long-term rental, and the Leas Home platform.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors font-semibold text-blue-900 text-lg"
                onClick={() => handleToggle(idx)}
                aria-expanded={activeKey === idx}
                aria-controls={`faq-panel-${idx}`}
                id={`faq-header-${idx}`}
                type="button"
              >
                <span>{faq.question}</span>
                {activeKey === idx ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-slate-400" />
                )}
              </button>
              <div
                id={`faq-panel-${idx}`}
                role="region"
                aria-labelledby={`faq-header-${idx}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden bg-blue-50 px-6 ${
                  activeKey === idx
                    ? "max-h-96 opacity-100 py-4"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <div className="text-slate-700 text-base">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="text-center">
          <h5 className="font-bold text-xl mb-3 text-blue-800">Still have questions?</h5>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-6 py-3 text-lg font-semibold shadow hover:bg-blue-700 transition mb-2 sm:mb-0"
            >
              <FaUserCircle className="mr-2" /> Create Free Account
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 px-6 py-3 text-lg font-semibold bg-white hover:bg-blue-50 transition"
            >
              <FaBookOpen className="mr-2" /> Visit Knowledge Base
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white text-slate-700 px-5 py-2 font-medium hover:bg-slate-100 transition"
          >
            <FaHome className="mr-2" /> Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white text-slate-700 px-5 py-2 font-medium hover:bg-slate-100 transition"
          >
            Browse Properties
          </Link>
          <Link
            href="/cooper"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white text-slate-700 px-5 py-2 font-medium hover:bg-slate-100 transition"
          >
            <FaCalculator className="mr-2" /> Cooper Index
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white text-slate-700 px-5 py-2 font-medium hover:bg-slate-100 transition"
          >
            Terms &amp; Privacy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
