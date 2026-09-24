import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'

function Root() {
  const [ready, setReady] = useState(false)

  return (
    <>
      {!ready && <Preloader onFinish={() => setReady(true)} />}
      {ready && (
        <BrowserRouter basename="/examhub">
          <App />
        </BrowserRouter>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
