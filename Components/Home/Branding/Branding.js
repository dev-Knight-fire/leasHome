import React from "react";

const offerCategories = [
  {
    number: 1,
    title: "Property Leasing",
    description:
      "Lease residential or commercial properties with flexible terms and professional support.",
  },
  {
    number: 2,
    title: "Land & Building Lease",
    description:
      "Secure land or entire buildings for your business or development needs, with expert guidance.",
  },
  {
    number: 3,
    title: "Long-term Rental (5+ years)",
    description:
      "Enjoy stability and peace of mind with long-term rental agreements, ideal for families and businesses.",
  },
  {
    number: 4,
    title: "With Purchase Option",
    description:
      "Lease with the flexibility to purchase the property in the future—perfect for those planning ahead.",
  },
  {
    number: 5,
    title: "For Investors & Leasing Companies",
    description:
      "Tailored solutions for investors and leasing companies seeking portfolio growth and reliable returns.",
  },
  {
    number: 6,
    title: "Corporate Relocation",
    description:
      "Comprehensive leasing solutions tailored for corporate clients relocating employees or offices efficiently.",
  },
];

const Branding = () => {
  return (
    <div className="my-12">
      <div className="max-w-3xl mx-auto text-center mb-12 px-4">
        <h2 className="font-bold text-3xl md:text-4xl text-primary mb-4">
          Explore Our Offer Categories
        </h2>
        <p className="text-lg text-gray-600">
          Flexible solutions for property seekers, investors, and leasing companies.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {offerCategories.map((cat) => (
          <div
            key={cat.number}
            className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full transition-transform hover:scale-105"
          >
            <div className="flex items-center mb-4 mt-6 px-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold text-lg mr-3">
                {cat.number}
              </span>
              <span className="text-xl font-semibold text-gray-800">{cat.title}</span>
            </div>
            <div className="px-6 pb-6 flex-1">
              <p className="text-gray-600">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branding;