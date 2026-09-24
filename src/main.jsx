import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'

function Root() {
  const [ready, setReady] = useState(false)

  return (
    <>
      {!ready && <Preloader onFinish={() => setReady(true)} />}
      {ready && (
        <HashRouter>
          <App />
        </HashRouter>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
