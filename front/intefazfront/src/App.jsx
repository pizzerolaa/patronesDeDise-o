import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar/Navbar";
import Default from "./pages/mainPages/Default";
import Home from "./pages/mainpages/Home";
import About from "./pages/mainpages/About";
import Dashbord from "./pages/mainpages/Dashbord";
import Products from "./pages/mainpages/Products";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Barra de navegación */}
        <Navbar />
        {/* Contenido de la página */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashbord" element={<Dashbord />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Default />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;