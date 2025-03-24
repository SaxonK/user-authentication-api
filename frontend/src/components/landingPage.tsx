import '@/assets/css/landingPage.css';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SignUp from "./signup/signup";
import Login from "./login/login";

interface Tab {
  title: string,
  visible: boolean;
};
interface States {
  [key: string]: Tab;
};

function LandingPage() {
  const [states, setStates] = useState<States>({
    login: {
      title: "Log In",
      visible: true
    }, 
    signup: {
      title: "Sign Up",
      visible: false
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isActive = localStorage.getItem('active');

    if(isActive === null) {
      localStorage.setItem('active', 'false');
    } else if (isActive === 'true') {
      navigate('/user');
    } else {
      return;
    };

  }, []);

  const toggleForm = (name: string): void => {
    setStates((prev) => {
      const newTabs = { ...prev };

      for (const key in newTabs) {
        if (newTabs[key].visible) newTabs[key] = { ...newTabs[key], visible: false };
        if (key === name) newTabs[key].visible = true;
      }

      return newTabs;
    });
  };

  const tabs = Object.entries(states).map(([key, value]) => (
    <div key={key} className={`tab ${key} ${value.visible ? 'active' : ''}`} onClick={() => toggleForm(key)}>{value.title}</div>
  ));

  return (
    <div className="landing-page-forms">
      <div className="tabs">{tabs}</div>
      {states.login.visible ? <Login /> : ''}
      {states.signup.visible ? <SignUp /> : ''}
    </div>
  );
};

export default LandingPage;