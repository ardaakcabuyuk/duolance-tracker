import { Routes, Route, HashRouter } from "react-router-dom";
import CardTimer from "./components/CardTimer";
import Contracts from './components/Contracts';
import Login from './components/Login';
import Cards from './components/Cards';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="cards" element={<Cards />} />
        <Route path="card-timer" element={<CardTimer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
