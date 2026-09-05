import React, { useState, useEffect } from 'react';
import { productService } from '../../../apiServices/userApiServices.jsx'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductCollection from '../../UserComponents/products/ProductCollection';
import { motion } from 'framer-motion';
import { AlertCircle} from 'lucide-react';
import Breadcrumbs from '../../../pages/others/commonReusableComponents/breadCrumbs';

const CategoryProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-2xl font-bold text-gray-800 tracking-wide"
        >
          Loading Collections...
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "128px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="h-1 bg-blue-600 mt-4 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center p-4"
      >
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4">
        <div className="mb-8 w-full flex justify-start">
          <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Collections', path: '/collections' }]} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
            Featured <span className="text-blue-600">Collections</span>
          </h1>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto text-lg">
            Explore our handpicked selection of premium laptops tailored to your specific needs.
          </p>
        </motion.div>

        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProductCollection categoryId={category._id} categoryName={category.name} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
