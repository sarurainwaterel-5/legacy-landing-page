import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Replace logo/family with optimized assets when available
const replaceOptimizedImages = () => {
  try{
    if ('loading' in HTMLImageElement.prototype) {
      // prefer webp if available
      fetch('/logo.webp', {method:'HEAD'}).then(r=>{ if(r.ok) document.querySelectorAll('img[src="/logo.png"]').forEach(i=>i.src='/logo.webp')}).catch(()=>{});
      fetch('/family-opt.jpg', {method:'HEAD'}).then(r=>{ if(r.ok) document.querySelectorAll('img[src="/family.jpg"]').forEach(i=>i.src='/family-opt.jpg')}).catch(()=>{});
    }
  }catch(e){}
}
window.addEventListener('load', replaceOptimizedImages);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
