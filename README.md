# OceanOfLaptops Frontend

Welcome to the frontend repository of **OceanOfLaptops**!

## About OceanOfLaptops
OceanOfLaptops is a modern, full-stack e-commerce platform dedicated exclusively to laptops and tech accessories. Beyond a simple CRUD application, this project was built to solve real-world e-commerce challenges with production-grade engineering. It handles everything from product discovery and cart management to secure payments and admin reporting, focusing on performance, UX, and reliable state management.

## Technology Stack
The frontend is built with performance and modern development practices in mind. Key technologies include:

- **Core:** React 18, Vite (for fast HMR and optimized production builds)
- **State Management:** Redux Toolkit (global state) & Zustand
- **Routing:** React Router v7
- **Styling & UI:** Tailwind CSS, Material UI (@mui/material), Framer Motion (micro-animations), Lucide React & FontAwesome (icons)
- **Data Fetching:** Axios
- **Payments:** Razorpay (seamless frontend checkout integration)
- **Authentication:** @react-oauth/google for Google SSO, jwt-decode
- **Charts & Reporting:** Chart.js, Recharts
- **Image Processing:** react-image-crop, cropperjs
- **PDF/Exports:** jsPDF, xlsx

## Features

### Authentication & Authorization
- Secure JWT handling (tokens are stored securely via HttpOnly cookies by the backend)
- Google OAuth Single Sign-On
- Protected routes based on user roles (Customer vs. Admin)

### Shopping Experience
- Dynamic product browsing, filtering, and searching
- Detailed product pages with image galleries and zoom capabilities
- Wishlist functionality to save favorite items

### Checkout & Payments
- Cart management with persistent state
- Seamless, modal-based checkout experience using Razorpay integration
- Handles payment failures, retries, and success callbacks directly from the UI

### Order Management
- Order history and tracking
- Order cancellation and return request workflows
- Wallet balance views and refund tracking

### Admin Dashboard
- Comprehensive sales reporting and analytics (powered by Chart.js/Recharts)
- Product, category, and inventory management
- Order fulfillment and status tracking
- Excel/PDF report generation

## Architecture & Structure
The project follows a modular, feature-based architecture:
- `/src/components` - Reusable, atomic UI components.
- `/src/pages` - High-level route components, separated by roles (e.g., User vs Admin).
- `/src/redux` & `/src/store` - Global state management setup (slices, actions, reducers).
- `/src/api` & `/src/apiServices` - Centralized Axios configuration and API service functions.
- `/src/routes` - Application routing logic and protected route wrappers.

## Deployment Configuration
The frontend is optimized for deployment on modern edge networks (like Vercel). 
- **Build tool:** Vite produces a highly optimized static bundle (`npm run build`).
- **Environment Variables:** Handled via `.env` files (e.g., `VITE_BASE_URL` for the backend API, `VITE_RAZORPAY_KEY` for checkout).

## Future Improvements / Roadmap

### Implemented 
- Comprehensive e-commerce flows (Cart, Wishlist, Checkout)
- Admin dashboards with visual reporting
- Razorpay payment integration with retry handling
- Secure JWT & Google SSO authentication

### Planned 
- **AI-Powered Recommendation Engine:** Suggest laptops based on user needs (e.g., "I need a laptop for video editing").
- **Custom PC/Laptop Builder:** Interactive UI to customize specs before purchase.
- **Improved Review System:** Verified purchase badges and image uploads for reviews.
- **Performance Optimization:** Deeper code-splitting and progressive image loading.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your `.env` file with necessary keys (e.g., `VITE_BASE_URL`).
4. Start the dev server: `npm run dev`
