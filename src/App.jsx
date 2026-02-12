import { Routes, Route } from "react-router-dom";
import Painel from "./pages/painel";
import Login from "./pages/Login.jsx";
import Admin from "./pages/admin";
import PrivateRoute from "./components/PrivateRouter.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Painel />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
