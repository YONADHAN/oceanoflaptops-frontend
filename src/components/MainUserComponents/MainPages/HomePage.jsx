


import React, { useState, useEffect } from 'react';
import Banner from '../../UserComponents/Banner/Banner';
import ProductCollection from '../../UserComponents/products/ProductCollection';
import ComparisonModule from '../../MainComponents/ComparisonModule'
import { productService } from '../../../apiServices/userApiServices'
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Wrench, Cpu, MonitorPlay, HardDrive } from 'lucide-react';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategoryList();
      
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error('Failed to fetch categories');
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Error fetching categories");
      setError('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <Banner />

      {/* Features Section */}
      <section className="py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Why Choose Our Laptops?
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              We deliver unparalleled performance, uncompromising quality, and support that never sleeps.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: "Premium Quality", desc: "Military-grade durability and premium materials ensure long-lasting performance." },
              { icon: Clock, title: "Fast Support", desc: "24/7 technical support and on-site service within 24 hours." },
              { icon: Wrench, title: "3-Year Warranty", desc: "Comprehensive warranty covering parts and accidental damage." }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Tech Specs Highlight */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden mb-12">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Cutting-Edge <span className="text-blue-400">Technology</span></h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">Experience uncompromised power with the latest hardware architecture designed for maximum performance and efficiency.</p>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 border border-blue-500/30">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Advanced Processors</h4>
                    <p className="text-blue-200">Latest Gen Intel® Core™ & AMD Ryzen™</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 border border-blue-500/30">
                    <MonitorPlay size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Dedicated Graphics</h4>
                    <p className="text-blue-200">NVIDIA® GeForce RTX™ & AMD Radeon™</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 border border-blue-500/30">
                    <HardDrive size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Ultra-Fast Storage</h4>
                    <p className="text-blue-200">Lightning fast PCIe NVMe SSDs</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-700 group"
            >
              <img
                src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1632&q=80"
                alt="Laptop internals"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <ComparisonModule />

      {/* Product Collections */}
      <section className="py-16 px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto ">
          

          {categories.map((category, index) => (
            <motion.div 
              key={category._id} 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCollection categoryId={category._id} categoryName={category.name} />
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
}

export default HomePage;