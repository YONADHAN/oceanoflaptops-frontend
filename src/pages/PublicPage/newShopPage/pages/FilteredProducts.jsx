// import React, { useState } from 'react'
// import ProductCard from '../../../../components/UserComponents/products/productCardModel'
// import {  useNavigate} from 'react-router-dom'
// const FilteredProducts = (productsData) => {
//   const navigate = useNavigate();
//   const handleProductClick = (productId) => {
//     navigate(`/product_detail/${productId}`)
//   }

//   return (
//     <div>

//       <h1>Filtered Products</h1>
//       {/* <p>{JSON.stringify(productsData.products)}</p> */}
//       {/* { product, onProductClick, fromLandingPage = false } */}
        
//        { productsData.products.map((product,index) => {
//         <div key={index}>
//           <productCard product={product} onProductClick={()=>handleProductClick(product._id)} />
//         </div>
//       })}

//     </div>
//   )
// }

// export default FilteredProducts


import React from 'react';
import ProductCard from '../../../../components/UserComponents/products/productCardModel';
import { useNavigate } from 'react-router-dom';

const FilteredProducts = ({ products = [] }) => {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product_detail/${productId}`);
    };

    return (
        <div className="w-full">
            {/* Grid layout for products */}
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 md:gap-x-3  gap-6 justify-items-center">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className=' scale-90 lg:scale-100'>
                            <ProductCard 
                                product={product} 
                                onProductClick={handleProductClick}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xl font-medium">No products match your filters</p>
                        <p className="mt-2 text-sm">Try adjusting your search or clearing some filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilteredProducts;