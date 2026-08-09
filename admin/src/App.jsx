import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectsList from "./pages/ProjectsList.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />}
             />
             <Route path="/projects" element={<ProjectsList />} />
             <Route path="/projects/new" element={<ProjectForm />} />
             <Route path="/projects/:id" element={<ProjectForm />} />

            { /* Tasks 16–18 add: /projects, /projects/new, /projects/:id,
                /services, /team, /testimonials, /settings */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}