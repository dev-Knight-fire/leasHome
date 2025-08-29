import React from "react";
import Link from "next/link";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using this website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
  },
  {
    title: "2. Use of the Site",
    content: [
      "You must be at least 18 years old or have the involvement of a parent or guardian to use this site.",
      "You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the site.",
      "You are responsible for maintaining the confidentiality of your account and password.",
    ],
  },
  {
    title: "3. Intellectual Property",
    content: `All content, features, and functionality on this site (including but not limited to text, graphics, logos, and software) are the property of the site owner or its licensors and are protected by copyright and other intellectual property laws.`,
  },
  {
    title: "4. User Content",
    content: [
      "You retain ownership of any content you submit, post, or display on or through the site.",
      "By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the operation of the site.",
      "You are solely responsible for the content you provide and its legality.",
    ],
  },
  {
    title: "5. Prohibited Activities",
    content: [
      "Uploading or transmitting viruses or any other malicious code.",
      "Attempting to gain unauthorized access to the site or user accounts.",
      "Using the site for any fraudulent or unlawful purpose.",
      "Impersonating any person or entity.",
    ],
  },
  {
    title: "6. Disclaimer",
    content: `This site and its content are provided "as is" without warranties of any kind, either express or implied. We do not warrant that the site will be error-free or uninterrupted.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `In no event shall the site owner or its affiliates be liable for any damages arising out of the use or inability to use the site, even if we have been notified of the possibility of such damages.`,
  },
  {
    title: "8. Changes to Terms",
    content: `We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting. Your continued use of the site constitutes acceptance of the revised terms.`,
  },
  {
    title: "9. Governing Law",
    content: `These terms are governed by and construed in accordance with the laws of the jurisdiction in which the site owner operates.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about these Terms of Use, please contact us via the information provided on our Contact page.`,
  },
];

const cooperExplanation = [
  {
    title: "What is the Cooper Calculator?",
    content: `The Cooper Calculator is a tool designed to help users assess their eligibility or suitability for a property lease based on several key factors. It provides a points-based evaluation to give you a quick overview of your standing as a lease candidate.`,
  },
  {
    title: "How Does It Work?",
    content: [
      "You answer a series of questions about your age, lease duration, health insurance status, annual account balance, property location, and property size.",
      "Each answer is assigned a certain number of points based on its favorability.",
      "After completing all questions, your total score is calculated out of a maximum of 30 points.",
      "Based on your total points, you receive a recommendation regarding your suitability as a lease candidate.",
    ],
  },
  {
    title: "What Do the Results Mean?",
    content: [
      "25–30 points: Excellent candidate for lease.",
      "15–24 points: Good candidate for lease.",
      "10–14 points: Fair candidate – review carefully.",
      "Below 10 points: Poor candidate – high risk.",
    ],
  },
  {
    title: "Why Use the Cooper Calculator?",
    content: [
      "It provides a transparent and objective way to evaluate your lease application.",
      "You can identify areas to improve your eligibility before applying.",
      "It helps both applicants and property managers make informed decisions.",
    ],
  },
  {
    title: "Disclaimer",
    content: `The Cooper Calculator is intended for informational purposes only. It does not guarantee approval or rejection of any lease application. Final decisions are made by property managers or landlords based on their own criteria.`,
  },
];

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-blue-100 p-8 md:p-12 relative overflow-hidden mb-12">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-blue-400 to-indigo-400 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-300 to-blue-300 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-green-500 drop-shadow mb-2">
          Terms of Use
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium tracking-wide">
          Last updated: <span className="font-semibold text-blue-600">August 2025</span>
        </p>
        <div className="divide-y divide-blue-100">
          {terms.map((section, idx) => (
            <div key={section.title} className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <span className="inline-block w-6 h-6 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full text-white flex items-center justify-center font-mono text-base shadow-md">
                  {idx + 1}
                </span>
                {section.title.replace(/^\d+\.\s/, "")}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                  {section.content.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">About the Cooper Calculator</h2>
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 p-8 mb-8">
          {cooperExplanation.map((section, idx) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{section.title}</h3>
              {Array.isArray(section.content) ? (
                <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700">
                  {section.content.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
