import React from "react";
import { motion } from "framer-motion";
import { Laptop, Cpu, ShieldCheck, HeadphonesIcon } from "lucide-react";
import Breadcrumbs from '../../pages/others/commonReusableComponents/breadCrumbs';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* <Navbar /> */}

      <div className="container mx-auto px-4 w-full pt-4">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }]} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 bg-gradient-to-b from-blue-900 to-gray-900 text-white mt-4">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Elevating Your <span className="text-blue-400">Computing Experience</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            At Ocean of Laptops, we provide industry-leading technology solutions tailored for professionals, creators, and enterprises. Discover uncompromising performance, premium quality, and exceptional reliability.
          </motion.p>
        </div>

        {/* Abstract Tech Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16 max-w-7xl">

        {/* Our Story Section */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center">
                <Laptop className="mr-4 text-blue-600" size={36} />
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Ocean of Laptops, we've been riding the waves of technology since our inception. Our journey has been marked by a commitment to providing cutting-edge laptops to tech enthusiasts, professionals, and casual users alike.
                </p>
                <p>
                  With years of experience in the industry, we've built a reputation for excellence, reliability, and customer satisfaction that sets us apart in the vast sea of tech retailers. We understand that a laptop isn't just a device—it's your office, your studio, and your gateway to the world.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1632&q=80"
                alt="Professional working on laptop"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Stats / Specs Section */}
        <section className="mb-24 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Hardware Stats</h2>
            <p className="text-gray-500 text-lg">The specifications that drive our success.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "100,000+", desc: "Laptops Sold", details: "Supplied across the country to satisfied professionals." },
              { icon: ShieldCheck, title: "99%", desc: "Satisfaction Rate", details: "Industry-leading reliability and quality assurance." },
              { icon: HeadphonesIcon, title: "24/7", desc: "Premium Support", details: "Round-the-clock technical assistance for our clients." }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{stat.title}</h3>
                <h4 className="text-xl font-semibold text-blue-600 mb-3">{stat.desc}</h4>
                <p className="text-gray-600">{stat.details}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Supply Chain Section */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl group md:order-1 order-2"
            >
              <img
                src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1632&q=80"
                alt="Laptop Motherboard and Supply Chain"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:order-2 order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Global Supply Architecture
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  We've established strong partnerships with leading laptop manufacturers and distributors worldwide. This architecture allows us to offer a wide range of high-quality laptops at competitive prices.
                </p>
                <p>
                  Our efficient supply chain ensures that we always have the latest silicon, GPUs, and models in stock. From lightweight ultrabooks to heavy-duty gaming rigs, we are ready to deliver to our customers with minimal latency.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Trusted by Innovators</h2>
          <div className="max-w-4xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed space-y-6">
            <p>
              We're proud to have built a loyal customer base that keeps coming back for their computing needs. From individual developers and designers to large corporate fleets, our clients trust us for our technical expertise, genuine products, and exceptional service.
            </p>
            <p>
              Many of our customers have been with us since version 1.0, and their continued support drives us to maintain our high bandwidth of service and constantly upgrade our offerings.
            </p>
          </div>
        </motion.section>

      </main>


    </div>
  );
};

export default AboutUs;
