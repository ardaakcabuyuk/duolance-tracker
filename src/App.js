import { Routes, Route, HashRouter } from "react-router-dom";
import CardTimer from "./components/CardTimer";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Cards from './components/Cards';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cards" element={<Cards />} />
        <Route path="contract-details" element={<CardTimer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
