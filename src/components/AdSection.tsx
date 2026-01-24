import React from 'react';

const AdSection = () => (
  <section className="flex flex-col items-center justify-center max-w-md mx-auto mt-16 rounded-2xl bg-[#FFE082] p-8 shadow-lg">
    {/* Product Image Placeholder */}
    <div className="w-full h-64 bg-white rounded-xl mb-8 border-4 border-[#FFE082]"></div>

    {/* Product Title */}
    <h2 className="text-2xl font-bold text-[#217346] text-center mb-4">
      Organic Green Tea - 50 Bags
    </h2>

    {/* Product Description */}
    <p className="text-base text-gray-700 text-center mb-6">
      Premium organic green tea leaves in compostable tea bags. Rich in antioxidants and flavor.
    </p>

    {/* Price Section */}
    <div className="flex items-center justify-center mb-8">
      <span className="text-3xl font-extrabold text-[#217346] mr-3">$14.99</span>
      <span className="text-xl font-bold text-[#d3b866] line-through">$19.99</span>
    </div>

    {/* Shop Now Button */}
    <button className="w-full py-4 bg-[#217346] text-white text-xl font-semibold rounded-full transition-colors hover:bg-[#185c36]">
      Shop Now
    </button>
  </section>
);

export default AdSection;
