import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, Users, Settings, Tag, User, ShoppingCart,PackageSearch, Image, Gift, Sliders, ClipboardList ,ListOrdered} from 'lucide-react';
import Header from '../../components/MainComponents/Header';
import Sidebar from '../../components/MainComponents/Sidebar';
import Footer from '../../components/MainComponents/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);  

  const role = "admin";
  const isAuthenticated = true; 
  const userAvatar = null; 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async() => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/admin/signin');
    } catch (error) {
      window.location.reload();
    }
  };

  const navItems = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
    {title:'Sales Report', url:'/admin/sales_report', icon: ClipboardList},
    { title: 'Category', url: '/admin/category', icon: Tag },
    { title: 'Products', url: '/admin/products', icon: PackageSearch },  
    { title: 'Customers', url: '/admin/customers', icon: Users },
    { title: 'Orders', url: '/admin/orders', icon: ListOrdered },
    // { title: 'Banner', url: '/admin/banner', icon: Image },
    { title: 'Coupon', url: '/admin/coupon', icon: Gift },
    // { title: 'Settings', url: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} `}>
      <Header
        role={role}
        toggleSidebar={toggleSidebar}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        userAvatar={userAvatar}
      />
      <Sidebar
        isVisible={isSidebarOpen}
        onClose={toggleSidebar}
        role={role}
        handleLogout={handleLogout}
        navItems={navItems}
      />
      <main className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-black/5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>
      <Footer role={role} />
    </div>
  );
};

export default AdminLayout;

