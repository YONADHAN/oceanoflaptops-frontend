


"use client"

import React, { useState, useCallback, useMemo } from "react"
import { FilterIcon, PanelLeftCloseIcon as CloseIcon, SearchIcon } from "lucide-react"
import { motion } from "framer-motion"

import Filter from './shopPageComponents/Filter';
import { axiosInstance } from '../../../api/axiosConfig';
import FilteredProducts from '../newShopPage/pages/FilteredProducts';
import Pagination from '../../../components/MainComponents/Pagination';
import Breadcrumbs from '../../others/commonReusableComponents/breadCrumbs';


const ResponsiveShopPage = () => {
  const [productsData, setProductData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [currentFilter, setCurrentFilter] = useState({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const limit = useMemo(() => 12, [])

  const debounce = (func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const fetchProducts = useCallback(
    async (filterQuery, page) => {
      try {
        setLoading(true)
        const queryData = {
          finalQuery: { ...filterQuery, searchTerm },
          currentPage: page,
          limit,
        }
        //console.log("Fetching products with query:", JSON.stringify(queryData, null, 2))
        const response = await axiosInstance.post("/public/filter_apply_and_get_data", queryData)

        if (response.data.success) {
          setProductData(response.data.products)
          setTotalPages(Math.ceil(response.data.totalCount / limit))
          setCurrentPage(page)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    },
    [searchTerm, limit],
  )

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value)
      fetchProducts(currentFilter, 1)
    }, 500),
    [fetchProducts],
  )

  const handleFinalQuery = useCallback(
    (filterQuery) => {
      setCurrentFilter(filterQuery)
      fetchProducts(filterQuery, 1)
      //   setIsFilterOpen(false)
    },
    [fetchProducts],
  )

  const handlePageChange = useCallback(
    (page) => {
      fetchProducts(currentFilter, page)
    },
    [currentFilter, fetchProducts],
  )

  const handleSearchInput = (event) => {
    handleSearch(event.target.value)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 ml-6 ">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleFilter}
            className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Toggle filter"
          >
            {isFilterOpen ? <CloseIcon size={24} /> : <FilterIcon size={24} />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <div
            className={`
            fixed inset-y-0 left-0 bg-white z-50 w-[280px] shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
            lg:relative lg:translate-x-0 lg:w-1/4 lg:block lg:bg-transparent lg:shadow-none lg:z-auto
            overflow-y-auto lg:overflow-visible
          `}
          >
            {/* Close button for mobile */}
            <div className="lg:hidden p-4 border-b flex justify-between items-center bg-gray-50">
              <span className="font-bold text-gray-800">Filters</span>
              <button
                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                onClick={toggleFilter}
                aria-label="Close filter"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="p-4 lg:p-0">
              <Filter onFilterChange={handleFinalQuery} />
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4 w-full flex flex-col space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products by brand, model, or keywords..."
                onChange={handleSearchInput}
                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 text-lg"
              />
            </motion.div>

            <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100/50 min-h-[500px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-2xl font-bold text-gray-800 tracking-wide mb-4"
                  >
                    Finding the best laptops for you...
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "128px" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="h-1 bg-blue-600 rounded-full"
                  />
                </div>
              ) : (
                <FilteredProducts products={productsData} />
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center border-t border-gray-100 pt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ResponsiveShopPage)

