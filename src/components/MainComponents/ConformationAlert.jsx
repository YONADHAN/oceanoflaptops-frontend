import React from "react";

const ConfirmationAlert = ({
  show,
  title,
  message,
  onCancel,
  onProceed,
  noText = "No",
  yesText = "Yes",
  proceedDisabled = false
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[28rem] animate-in zoom-in-95 duration-200">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="text-gray-600 mt-3">{message}</div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none transition-colors"
          >
            {noText}
          </button>
          <button
            onClick={onProceed}
            disabled={proceedDisabled}
            className={`px-5 py-2.5 font-medium rounded-xl focus:outline-none transition-all ${proceedDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md'
              }`}
          >
            {yesText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;





// import React, { useState } from "react";
// import ConfirmationAlert from "./ConfirmationAlert";

// const App = () => {
//   const [showAlert, setShowAlert] = useState(false);

//   const handleCancel = () => {
//     console.log("Process canceled!");
//     setShowAlert(false);
//   };

//   const handleProceed = () => {
//     console.log("Process proceeded!");
//     setShowAlert(false);
//   };

//   return (
//     <div className="p-4">
//       <button
//         onClick={() => setShowAlert(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Show Alert
//       </button>
//       <ConfirmationAlert
//         show={showAlert}
//         title="Are you sure?"
//         message="Do you want to proceed with this action?"
//         onCancel={handleCancel}
//         onProceed={handleProceed}
//         noText="Cancel"
//         yesText="Confirm"
//       />
//     </div>
//   );
// };

// export default App;
