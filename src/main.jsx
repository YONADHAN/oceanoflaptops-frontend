import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import ErrorBoundary from './components/MainComponents/ErrorBoundary.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  //</StrictMode>,
)
