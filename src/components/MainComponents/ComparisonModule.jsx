import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { axiosInstance } from '../../api/axiosConfig'

const ProductComparison = () => {
  const [activeTab, setActiveTab] = useState('product1');
  const [laptop1Name, setLaptop1Name] = useState("");
  const [laptop2Name, setLaptop2Name] = useState("");
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [selectedLaptops, setSelectedLaptops] = useState({
    laptop1: null,
    laptop2: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  const laptopDatabase = [
    {
      productName: "MacBook Pro M3",
      brand: "Apple",
      modelNumber: "MBP2024",
      processor: { brand: "Apple", model: "M3 Pro", generation: "3rd" },
      ram: { size: "32GB", type: "Unified" },
      storage: { type: "SSD", capacity: "1TB" },
      graphics: { model: "M3 Pro GPU", vram: "16-core" },
      display: { size: "16.2", resolution: "3456 x 2234", refreshRate: "120Hz" },
      operatingSystem: "macOS",
      batteryLife: "22",
      weight: "2.2",
      salePrice: 199900
    },
    {
      productName: "Dell XPS 15",
      brand: "Dell",
      modelNumber: "XPS 9520",
      processor: { brand: "Intel", model: "Core i9", generation: "13th" },
      ram: { size: "32GB", type: "DDR5" },
      storage: { type: "SSD", capacity: "2TB" },
      graphics: { model: "NVIDIA RTX 4070", vram: "8GB" },
      display: { size: "15.6", resolution: "3840 x 2400", refreshRate: "60Hz" },
      operatingSystem: "Windows 11",
      batteryLife: "12",
      weight: "1.8",
      salePrice: 189900
    }
  ];

  const handleCloseComparisonModule = async (req, res) => {
    setSelectedLaptops(
      {
        laptop1: null,
        laptop2: null
      }
    )
    setLaptop1Name("")
    setLaptop2Name("")
  }

  const fetchSuggestions = async (searchTerm, setSuggestions) => {
    try {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      const response = await axiosInstance.get(`/search?term=${searchTerm}`);
      setSuggestions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleLaptop1Search = (value) => {
    setLaptop1Name(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value, setSuggestions1);
    }, 300);
  };

  const handleLaptop2Search = (value) => {
    setLaptop2Name(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value, setSuggestions2);
    }, 300);
  };

  const handleSelectSuggestion = (product, isFirstLaptop) => {
    if (isFirstLaptop) {
      setLaptop1Name(product.productName);
      setSuggestions1([]);
      setSelectedLaptops(prev => ({
        ...prev,
        laptop1: product
      }));
    } else {
      setLaptop2Name(product.productName);
      setSuggestions2([]);
      setSelectedLaptops(prev => ({
        ...prev,
        laptop2: product
      }));
    }
  };

  // Function to render comparison row
  const ComparisonRow = ({ label, value1, value2 }) => (
    <div className="grid grid-cols-3 border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200">
      <div className="px-6 py-4 font-semibold text-gray-700 bg-gray-50/50 flex items-center">{label}</div>
      <div className="px-6 py-4 text-gray-600 flex items-center border-l border-r border-gray-100">{value1}</div>
      <div className="px-6 py-4 text-gray-600 flex items-center">{value2}</div>
    </div>
  );

  // Mobile card view for a single product
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
      <div className="border-b border-gray-100 pb-4 mb-5">
        <h3 className="text-xl font-bold text-gray-900">{product.productName}</h3>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div className="text-sm font-semibold text-gray-500">Brand</div>
          <div className="text-sm text-gray-900 font-medium">{product.brand}</div>

          <div className="text-sm font-semibold text-gray-500">Processor</div>
          <div className="text-sm text-gray-900 font-medium">{product.processor.model}</div>

          <div className="text-sm font-semibold text-gray-500">RAM</div>
          <div className="text-sm text-gray-900 font-medium">{product.ram.size}</div>

          <div className="text-sm font-semibold text-gray-500">Storage</div>
          <div className="text-sm text-gray-900 font-medium">{product.storage.capacity}</div>

          <div className="text-sm font-semibold text-gray-500">Graphics</div>
          <div className="text-sm text-gray-900 font-medium">{product.graphics.model}</div>

          <div className="text-sm font-semibold text-gray-500">Display</div>
          <div className="text-sm text-gray-900 font-medium">{product.display.size}" - {product.display.resolution}</div>

          <div className="text-sm font-semibold text-gray-500">OS</div>
          <div className="text-sm text-gray-900 font-medium">{product.operatingSystem}</div>

          <div className="text-sm font-semibold text-gray-500">Battery Life</div>
          <div className="text-sm text-gray-900 font-medium">{product.batteryLife} hrs</div>

          <div className="text-sm font-semibold text-gray-500">Weight</div>
          <div className="text-sm text-gray-900 font-medium">{product.weight} kg</div>

          <div className="text-sm font-semibold text-gray-500">Price</div>
          <div className="text-sm text-blue-600 font-bold">₹{product.salePrice.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );

  const ComparisonContent = ({ laptop1, laptop2 }) => (
    <>
      {/* Mobile View (< 768px) */}
      <div className="block md:hidden">
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1.5 shadow-inner">
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'product1'
                ? 'bg-white shadow-md text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('product1')}
          >
            {laptop1.productName}
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'product2'
                ? 'bg-white shadow-md text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('product2')}
          >
            {laptop2.productName}
          </button>
        </div>
        <div>
          {activeTab === 'product1' && <ProductCard product={laptop1} />}
          {activeTab === 'product2' && <ProductCard product={laptop2} />}
        </div>
        <button
          className="w-full py-4 mt-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors"
          onClick={handleCloseComparisonModule}
        >
          Close Comparison
        </button>
      </div>

      {/* Tablet/Desktop View (≥ 768px) */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Detailed Specifications</h2>
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
              onClick={handleCloseComparisonModule}
            >
              Clear Comparison
            </button>
          </div>
          <div className="p-0">
            <div className="grid grid-cols-3 border-b-2 border-gray-100 bg-gray-50">
              <div className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Feature</div>
              <div className="px-6 py-4 font-bold text-blue-600 text-lg border-l border-r border-gray-100">{laptop1.productName}</div>
              <div className="px-6 py-4 font-bold text-blue-600 text-lg">{laptop2.productName}</div>
            </div>

            <ComparisonRow label="Brand" value1={laptop1.brand} value2={laptop2.brand} />
            <ComparisonRow label="Processor" value1={laptop1.processor.model} value2={laptop2.processor.model} />
            <ComparisonRow label="RAM" value1={laptop1.ram.size} value2={laptop2.ram.size} />
            <ComparisonRow label="Storage" value1={laptop1.storage.capacity} value2={laptop2.storage.capacity} />
            <ComparisonRow label="Graphics" value1={laptop1.graphics.model} value2={laptop2.graphics.model} />
            <ComparisonRow
              label="Display"
              value1={`${laptop1.display.size}" - ${laptop1.display.resolution}`}
              value2={`${laptop2.display.size}" - ${laptop2.display.resolution}`}
            />
            <ComparisonRow label="OS" value1={laptop1.operatingSystem} value2={laptop2.operatingSystem} />
            <ComparisonRow
              label="Battery Life"
              value1={`${laptop1.batteryLife} hrs`}
              value2={`${laptop2.batteryLife} hrs`}
            />
            <ComparisonRow
              label="Weight"
              value1={`${laptop1.weight} kg`}
              value2={`${laptop2.weight} kg`}
            />
            <ComparisonRow
              label="Price"
              value1={`₹${laptop1.salePrice.toLocaleString()}`}
              value2={`₹${laptop2.salePrice.toLocaleString()}`}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl my-12 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-800"></div>
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Compare Laptops</h2>
        <p className="text-lg text-gray-500">Find the perfect match for your needs by comparing specifications side-by-side.</p>
      </div>

      {/* Search Section */}
      <div className="mb-10 p-6 bg-gray-50 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-gray-100">
        {/* First Laptop Search */}
        <div className="relative w-full md:w-2/5">
          <input
            type="text"
            placeholder="Search first laptop..."
            className="w-full px-5 py-4 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-gray-700"
            value={laptop1Name}
            onChange={(e) => handleLaptop1Search(e.target.value)}
          />
          {Array.isArray(suggestions1) && suggestions1.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
              {suggestions1.map((product) => (
                <div
                  key={product._id}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => handleSelectSuggestion(product, true)}
                >
                  <div className="font-semibold text-gray-900">{product.productName}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 shadow-sm">
          VS
        </div>

        {/* Second Laptop Search */}
        <div className="relative w-full md:w-2/5">
          <input
            type="text"
            placeholder="Search second laptop..."
            className="w-full px-5 py-4 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-gray-700"
            value={laptop2Name}
            onChange={(e) => handleLaptop2Search(e.target.value)}
          />
          {Array.isArray(suggestions2) && suggestions2.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
              {suggestions2.map((product) => (
                <div
                  key={product._id}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => handleSelectSuggestion(product, false)}
                >
                  <div className="font-semibold text-gray-900">{product.productName}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (selectedLaptops.laptop1 && selectedLaptops.laptop2) {
              setActiveTab('product1');
            } else {
              setError("Please select both laptops to compare");
            }
          }}
          className="w-full md:w-1/5 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!selectedLaptops.laptop1 || !selectedLaptops.laptop2}
        >
          Compare Now
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center animate-pulse">
          <svg className="w-5 h-5 mr-3 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Loading suggestions...
        </div>
      )}

      {/* Comparison Section */}
      {selectedLaptops.laptop1 && selectedLaptops.laptop2 && (
        <div className="mt-8 animate-fadeIn">
          <ComparisonContent
            laptop1={selectedLaptops.laptop1}
            laptop2={selectedLaptops.laptop2}
          />
        </div>
      )}
    </div>
  );
};

export default ProductComparison;