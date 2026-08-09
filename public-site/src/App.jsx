import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";


function Placeholder({ name }) {
  return <main className="container"><h1>{name} (coming in the next task)</h1></main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Placeholder name="Projects" />} />
        <Route path="/projects/:slug" element={<Placeholder name="Project detail" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}