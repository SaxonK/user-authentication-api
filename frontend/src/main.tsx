import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import '@/assets/css/main.css';
import LandingPage from './components/landingPage';
import UserProfile from './components/user/user';

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user" element={<UserProfile />} />
    </Routes>
  </BrowserRouter>
);