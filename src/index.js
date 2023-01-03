import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Organ from './Organ'
import About from './Routes/About'
import NoPage from './Routes/NoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Organ />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <App />
)