import type { InputFieldSettings } from '@/components/generic/form';
import {  useState } from "react";
import '@/assets/css/signup.css';
import Form from '@/components/generic/form';

interface RegisterData {
  firstName: string;
  lastName: string; 
  email: string;
  password: string;
};

function SignUp() {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fields: InputFieldSettings[] = [
    { name: 'first-name', required: true, type: "text", group: 'fullname' },
    { name: 'surname', required: true, type: "text", group: 'fullname' },
    { name: 'email', required: true, type: "email", group: '' },
    { name: 'new-password', required: true, type: "password-confirm", group: '' }
  ];

  const toggleMessage = (message: string, success: boolean): void => {
    setMessage(message);
    setIsSuccess(success);
    setShowMessage(true);
  };

  const register = async (formData: Record<string, string>): Promise<void> => {
    setShowMessage(false);

    try {
      const headers: Headers = new Headers();
      headers.set('content-type', 'application/json');
      headers.set('Accept', 'application/json');

      const formattedData: RegisterData = {
        "firstName": formData["first-name"],
        "lastName": formData["surname"],
        "email": formData["email"],
        "password": formData["new-password"]
      };

      const request: Request = new Request('/api/auth/register', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formattedData)
      });

      const response = await fetch(request);
      const data: { message: string } = await response.json();
      toggleMessage(data.message, response.ok);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <section id="sign-up">
      <div className="wrapper">
        <h2>Create Account</h2>
        <div className={`register-message ${showMessage ? 'visible' : 'hidden'} ${isSuccess ? 'success' : 'failed'}`}>{message}.</div>
        <Form
          action=''
          method="POST"
          target={null}
          buttonText='Register'
          fields={fields}
          displayRequirements={true}
          onSubmit={register}
        />
      </div>
    </section>
  );
};

export default SignUp;