import { Routes, Route, HashRouter } from "react-router-dom";
import ContractDetails from "./components/ContractDetails";
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="contract-details" element={<ContractDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
