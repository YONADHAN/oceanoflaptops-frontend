"use client"

import { useState, useEffect, useCallback } from "react"
import Pagination from "../../../components/MainComponents/Pagination"
import ConfirmationAlert from "../../../components/MainComponents/ConformationAlert"
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, Plus, ArrowRightLeft, CreditCard } from "lucide-react"
import { axiosInstance } from "../../../api/axiosConfig"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import Breadcrumbs from '../../others/commonReusableComponents/breadCrumbs'

const WalletComponent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [walletData, setWalletData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [amount, setAmount] = useState("")
  const [showConfirmAlert, setShowConfirmAlert] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [transactions, setTransactions] = useState([])
  const itemsPerPage = 5

  const fetchWalletData = useCallback(async (page) => {
    setIsLoading(true)
    try {
      if (!isAuthenticated || !user) {
        toast.error("Authentication token not found, please try to login again.")
        return
      }

      const currentUserId = user._id
      setUserId(currentUserId)

      const response = await axiosInstance.post("/get_wallet_history", {
        userId: currentUserId,
        page,
        limit: itemsPerPage,
      })

      if (!response.data.wallet) {
        toast.error("Wallet not found")
        return
      }

      setWalletData(response.data.wallet)
      setTransactions(response.data.wallet.transactions)
      setTotalTransactions(response.data.totalTransactions)
    } catch (error) {
      toast.info("Nothing is there in the wallet")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWalletData(currentPage)
  }, [currentPage, fetchWalletData])

  const handleConfirmSubmit = async () => {
    try {
      const response = await axiosInstance.post("/add_to_wallet", {
        userId,
        amount: Number.parseFloat(amount),
        transactionType: "credit",
        description: "Money added from Wallet",
      })

      if (!response.data.wallet) {
        toast.error("You have an empty Wallet. Add Money to your wallet.")
        return
      }

      setWalletData(response.data.wallet)
      toast.success("Money added to wallet successfully")
      setShowConfirmAlert(false)
      setAmount("")
      fetchWalletData(currentPage)
    } catch (error) {
      console.error("Error adding money to wallet:", error)
      toast.error("Failed to add money to wallet")
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const rows = transactions.map((transaction) => {
    let title = transaction.description;
    let subtitle = "";

    const refundMatch = title.match(/Refund for(?: cancelled product\(s\):| cancelled product:|) (.*)/i);
    const withdrawnMatch = title.match(/Withdrawn for: (.*)/i);

    if (refundMatch) {
      title = "Refund Received";
      subtitle = refundMatch[1];
    } else if (withdrawnMatch) {
      title = "Withdrawn from wallet";
      subtitle = withdrawnMatch[1];
    } else if (title.toLowerCase().includes("added money") || title.toLowerCase().includes("money added")) {
      title = "Wallet Top-up";
    }

    return {
      id: transaction._id || Math.random().toString(),
      type: transaction.type,
      title: title,
      subtitle: subtitle,
      date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(transaction.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: transaction.amount,
    };
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen"
    >
      <div className="mb-2">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/user/features/account' }, { label: 'Wallet', path: '/user/features/wallet' }]} />
      </div>

      {/* Wallet Balance Card - Premium Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-900 shadow-xl p-6 md:p-8 text-white mb-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-blue-200/80 mb-1">
              <Wallet className="w-4 h-4" />
              <span className="font-semibold tracking-wider text-sm uppercase">Total Balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                ₹{walletData?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </h2>
            </div>
            <p className="text-blue-200/60 text-sm mt-1 flex items-center gap-1.5">
              <CreditCard size={14} /> Available for immediate use
            </p>
          </div>

          {/* <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirmAlert(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </motion.button> */}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 border border-gray-100/50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
            <p className="text-gray-500 text-sm mt-1">Detailed history of your wallet activity</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden md:block">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        {isLoading && transactions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className={`flex flex-col transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <AnimatePresence>
              {rows.map((row, index) => {
                const isCredit = row.type.toLowerCase() === 'credit';
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={row.id}
                    className="group flex items-center justify-between p-6 md:p-8 border-b border-gray-50 hover:bg-blue-50/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${isCredit
                        ? 'bg-emerald-100/50 text-emerald-600 shadow-sm shadow-emerald-100'
                        : 'bg-rose-100/50 text-rose-600 shadow-sm shadow-rose-100'
                        }`}>
                        {isCredit ? <ArrowDownLeft size={24} strokeWidth={2.5} /> : <ArrowUpRight size={24} strokeWidth={2.5} />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-gray-900 text-base md:text-lg">{row.title}</p>
                        {row.subtitle && (
                          <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md self-start">
                            {row.subtitle.toLowerCase()}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            {row.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{row.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`font-bold text-lg md:text-xl tracking-tight ${isCredit ? 'text-emerald-600' : 'text-gray-900'
                        }`}>
                        {isCredit ? '+' : '-'}₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                        Completed
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div className="p-6 md:p-8 bg-gray-50/50 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalTransactions / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Wallet className="w-12 h-12 text-blue-300" />
            </div>
            <p className="text-gray-800 text-xl font-bold mb-2">No transactions yet</p>
            <p className="text-gray-500 max-w-sm">When you add funds or make a purchase using your wallet, the activity will appear here.</p>
          </motion.div>
        )}
      </div>

      <ConfirmationAlert
        show={showConfirmAlert}
        title="Add Funds to Wallet"
        message={
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-gray-600">Enter the amount you wish to add to your wallet.</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-bold transition-all"
              />
            </div>
          </div>
        }
        onCancel={() => {
          setShowConfirmAlert(false)
          setAmount("")
        }}
        onProceed={handleConfirmSubmit}
        noText="Cancel"
        yesText="Add Funds"
        proceedDisabled={!amount || Number(amount) <= 0}
      />
    </motion.div>
  )
}

export default WalletComponent