import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ageOptions = [
  { label: "18–24", value: "18-24", points: 2 },
  { label: "25–35", value: "25-35", points: 5 },
  { label: "36–50", value: "36-50", points: 5 },
  { label: "51–60", value: "51-60", points: 3 },
  { label: "61+", value: "61+", points: 1 },
];

const leaseOptions = [
  { label: "5–9 years", value: "5-9", points: 5 },
  { label: "10–14 years", value: "10-14", points: 4 },
  { label: "15–19 years", value: "15-19", points: 3 },
  { label: "20–25 years", value: "20-25", points: 2 },
  { label: "Over 25 years", value: "25+", points: 1 },
];

const insuranceOptions = [
  { label: "None", value: "none", points: 0 },
  { label: "Public only", value: "public", points: 2 },
  { label: "Private only", value: "private", points: 3 },
  { label: "Both public and private", value: "both", points: 5 },
];

const balanceOptions = [
  { label: "Less than 24,000 PLN", value: "<24000", points: 1 },
  { label: "24,000 – 47,999 PLN", value: "24000-47999", points: 2 },
  { label: "48,000 – 71,999 PLN", value: "48000-71999", points: 3 },
  { label: "72,000 – 99,999 PLN", value: "72000-99999", points: 4 },
  { label: "100,000 PLN or more", value: "100000+", points: 5 },
];

const locationOptions = [
  { label: "Category A (Cities with over 300,000 inhabitants)", value: "A", points: 5 },
  { label: "Category B (Cities with 100,000–299,999 inhabitants or towns within 20 km from Category A)", value: "B", points: 4 },
  { label: "Category C (Cities with 50,000–99,999 inhabitants or towns with strong transit connection to Category A)", value: "C", points: 2 },
  { label: "Category D (Towns under 50,000 inhabitants without direct connection to major cities)", value: "D", points: 1 },
];

const sizeOptions = [
  { label: "Less than 25 m²", value: "<25", points: 1 },
  { label: "25–44 m²", value: "25-44", points: 3 },
  { label: "45–80 m²", value: "45-80", points: 5 },
  { label: "81–120 m²", value: "81-120", points: 3 },
  { label: "More than 120 m²", value: ">120", points: 1 },
];

function getPoints(options, value) {
  const found = options.find((opt) => opt.value === value);
  return found ? found.points : 0;
}

function getLabel(options, value) {
  const found = options.find((opt) => opt.value === value);
  return found ? found.label : "";
}

const CooperCalculator = () => {
  const [form, setForm] = useState({
    age: "",
    lease: "",
    insurance: "",
    balance: "",
    location: "",
    size: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const totalPoints =
    getPoints(ageOptions, form.age) +
    getPoints(leaseOptions, form.lease) +
    getPoints(insuranceOptions, form.insurance) +
    getPoints(balanceOptions, form.balance) +
    getPoints(locationOptions, form.location) +
    getPoints(sizeOptions, form.size);

  const allSelected = Object.values(form).every((v) => v);

  // Get recommendation based on total points
  const getRecommendation = (points) => {
    if (points >= 25) return { text: "Excellent candidate for lease", color: "text-green-600" };
    if (points >= 15) return { text: "Good candidate for lease", color: "text-blue-600" };
    if (points >= 10) return { text: "Fair candidate - review carefully", color: "text-yellow-600" };
    return { text: "Poor candidate - high risk", color: "text-red-600" };
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    if (!allSelected) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("Cooper Calculator Results", 14, 22);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const data = [
        ["Field", "Selected Option", "Points"],
        [
          "Age Range",
          getLabel(ageOptions, form.age),
          getPoints(ageOptions, form.age).toString(),
        ],
        [
          "Lease Duration",
          getLabel(leaseOptions, form.lease),
          getPoints(leaseOptions, form.lease).toString(),
        ],
        [
          "Health Insurance",
          getLabel(insuranceOptions, form.insurance),
          getPoints(insuranceOptions, form.insurance).toString(),
        ],
        [
          "Annual Personal Account Balance",
          getLabel(balanceOptions, form.balance),
          getPoints(balanceOptions, form.balance).toString(),
        ],
        [
          "Property Location",
          getLabel(locationOptions, form.location),
          getPoints(locationOptions, form.location).toString(),
        ],
        [
          "Property Size (in m²)",
          getLabel(sizeOptions, form.size),
          getPoints(sizeOptions, form.size).toString(),
        ],
        ["", "TOTAL POINTS", totalPoints.toString()+"/30"],
      ];

      // Table
      doc.autoTable({
        head: [data[0]],
        body: data.slice(1, -1), // All rows except total
        startY: 40,
        theme: "grid",
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 90 },
          2: { cellWidth: 20, halign: 'center' }
        },
      });

      // Total row with special styling
      const finalY = doc.lastAutoTable.finalY + 5;
      doc.autoTable({
        body: [data[data.length - 1]], // Just the total row
        startY: finalY,
        theme: "grid",
        bodyStyles: {
          fontSize: 12,
          fontStyle: 'bold',
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 90 },
          2: { cellWidth: 20, halign: 'center', fillColor: [41, 128, 185], textColor: 255 }
        },
      });

      // Recommendation
      const recommendation = getRecommendation(totalPoints);
      const recY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendation:", 14, recY);
      doc.setFontSize(12);
      if (recommendation.color.includes('green')) doc.setTextColor(0, 150, 0);
      else if (recommendation.color.includes('blue')) doc.setTextColor(0, 100, 200);
      else if (recommendation.color.includes('yellow')) doc.setTextColor(200, 150, 0);
      else doc.setTextColor(200, 0, 0);
      doc.text(recommendation.text, 14, recY + 8);

      doc.save("cooper_calculator_results.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const recommendation = getRecommendation(totalPoints);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cooper Calculator</h1>
          <p className="text-gray-600">Calculate your lease application score</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Age */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
              1. Age Range
            </label>
            <select
              id="age"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select age range</option>
              {ageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Lease */}
          <div className="space-y-2">
            <label htmlFor="lease" className="block text-sm font-semibold text-gray-700">
              2. Lease Duration
            </label>
            <select
              id="lease"
              name="lease"
              value={form.lease}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select lease duration</option>
              {leaseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Insurance */}
          <div className="space-y-2">
            <label htmlFor="insurance" className="block text-sm font-semibold text-gray-700">
              3. Health Insurance
            </label>
            <select
              id="insurance"
              name="insurance"
              value={form.insurance}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select insurance status</option>
              {insuranceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <label htmlFor="balance" className="block text-sm font-semibold text-gray-700">
              4. Annual Personal Account Balance
            </label>
            <select
              id="balance"
              name="balance"
              value={form.balance}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select annual balance</option>
              {balanceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              5. Property Location
            </label>
            <select
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select property location</option>
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="size" className="block text-sm font-semibold text-gray-700">
              6. Property Size (in m²)
            </label>
            <select
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select property size</option>
              {sizeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.points} points)
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                allSelected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!allSelected}
            >
              Calculate Total Points
            </button>
          </div>
        </form>

        {submitted && allSelected && (
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Total Points: {totalPoints}/30
              </h3>
              <div className={`text-lg font-semibold ${recommendation.color}`}>
                {recommendation.text}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(totalPoints / 30) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Score: {Math.round((totalPoints / 30) * 100)}%
              </p>
            </div>
            
            <div className="text-center">
              <button
                className={`px-8 py-3 border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                  isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            </div>
          </div>
        )}

        {submitted && !allSelected && (
          <div className="mt-8 text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4">
              <h4 className="font-semibold mb-1">Incomplete Form</h4>
              <p>Please fill in all fields to calculate your points.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CooperCalculator;
