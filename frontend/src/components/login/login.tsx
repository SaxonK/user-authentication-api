import type { InputFieldSettings } from '@/components/generic/form';
import {  useState } from "react";
import { useNavigate } from "react-router";
import '@/assets/css/signup.css';
import Form from '@/components/generic/form';

interface LoginData {
  email: string;
  password: string;
};

function Login() {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const fields: InputFieldSettings[] = [
    { name: 'email', required: true, type: "email", group: '' },
    { name: 'password', required: true, type: "password", group: '' }
  ];

  const toggleMessage = (message: string, success: boolean): void => {
    setMessage(message);
    setIsSuccess(success);
    setShowMessage(true);
  };

  const login = async (formData: Record<string, string>): Promise<void> => {
    setShowMessage(false);

    try {
      const headers: Headers = new Headers();
      headers.set('content-type', 'application/json');
      headers.set('Accept', 'application/json');

      const formattedData: LoginData = {
        "email": formData["email"],
        "password": formData["password"]
      };

      const request: Request = new Request('/api/auth/login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formattedData)
      });

      const response = await fetch(request);
      const data: { message: string } = await response.json();
      toggleMessage(data.message, response.ok);

      if (response.ok) {
        localStorage.setItem('active', 'true');
        navigate("/user");
      } else {
        throw new Error('Invalid login credentials.');
      }
    } catch (error) {
      console.error("Unable to login:", error);
    }
  };

  return (
    <section id="sign-up">
      <div className="wrapper">
        <h2>Enter your credentials</h2>
        <div className={`register-message ${showMessage ? 'visible' : 'hidden'} ${isSuccess ? 'success' : 'failed'}`}>{message}.</div>
        <Form
          action=''
          method="POST"
          target={null}
          buttonText='Log in'
          fields={fields}
          displayRequirements={false}
          onSubmit={login}
        />
      </div>
    </section>
  );
};

export default Login;
