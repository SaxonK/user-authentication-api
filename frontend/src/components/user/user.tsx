import '@/assets/css/user.css';

import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/modules/auth/refresh";
import { useNavigate } from "react-router";
import EditableUserDetails from '@/components/user/editableUserDetails';
import ReadOnlyUserDetails from '@/components/user/readOnlyUserDetails';

interface ApiUserData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  phoneNumber: string;
  profilePicture: string;
  createdDate: Date | null;
};
export interface UserData {
  "first-name": string;
  "last-name": string;
  "email": string;
  "company": string;
  "country": string;
  "phone-number": string;
  "profile-picture": string;
  "created-date": Date | null;
};
interface UserUpdateState {
  success: boolean;
  message: string;
};

function UserProfile() {
  const navigate = useNavigate();
  const updateMessage = useRef<HTMLSpanElement>(null);
  const [userData, setUserData] = useState<UserData>({
    "first-name": '',
    "last-name": '',
    "email": '',
    "company": '',
    "country": '',
    "phone-number": '',
    "profile-picture": '',
    "created-date": null
  });
  const [editable, setEditable] = useState<boolean>(false);
  const [userUpdateState, setUpdateMessage] = useState<UserUpdateState>({
    success: false,
    message: ''
  });

  useEffect(() => {
    intialiseUserProfile();
  }, []);

  const getUserDetails = async (): Promise<void> => {
    try {
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');

      const request: Request = new Request('/api/user', {
        method: 'GET',
        headers: headers,
        credentials: "include"
      });

      const response = await fetch(request);

      if(response.ok) {
        const data: { user: ApiUserData } = await response.json();
        setUserData({
          "first-name": data.user["firstName"],
          "last-name": data.user["lastName"],
          "email": data.user["email"],  
          "company": data.user["company"],
          "country": data.user["country"],
          "phone-number": data.user["phoneNumber"],
          "profile-picture": data.user["profilePicture"],
          "created-date": data.user["createdDate"]
        });
      } else {
        throw new Error('Could not get user details. Failed authentication.');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const intialiseUserProfile = async (): Promise<void> => {
    try {
      await getUserDetails();
    } catch (error) {
      const token = await getAccessToken();
      if (token.status === 200) {
        try {
          await getUserDetails();
        } catch (error) {
          console.error('Failed re-attempting getUserDetails after token refresh:', error);
        }
      } else {
        localStorage.setItem('active', 'false');
        navigate('/');
        console.error('Could not refresh access token: ', error);
      }
    }
  };

  const deactivateUser = async (): Promise<void> => {
    try {
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');

      const request: Request = new Request('/api/user/deactivate', {
        method: 'POST',
        headers: headers,
        credentials: "include"
      });

      const response = await fetch(request);

      if(response.ok) {
        localStorage.setItem('active', 'false');
        navigate('/');
      } else {
        throw new Error('An error occured attempting to logout.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');

      const request: Request = new Request('/api/auth/logout', {
        method: 'POST',
        headers: headers,
        credentials: "include"
      });

      const response = await fetch(request);

      if(response.ok) {
        localStorage.setItem('active', 'false');
        navigate('/');
      } else {
        throw new Error('An error occured attempting to logout.');
      }
    } catch (error) {
      console.log(error);
      localStorage.setItem('active', 'false');
      navigate('/');
    }
  };

  const toggleEditable = async (): Promise<void> => {
    setEditable(!editable);
  };

  const backToProfile = async (): Promise<void> => {
    await intialiseUserProfile();
    await toggleEditable();
  };

  const updateMessageState = async (success: boolean, message: string): Promise<void> => {
    setUpdateMessage({
      success: success,
      message: message
    });
    if (userUpdateState.success) {
      updateMessage.current?.classList.remove('fail');
      updateMessage.current?.classList.add('success');
    } else {
      updateMessage.current?.classList.remove('success');
      updateMessage.current?.classList.add('fail');
    }

    updateMessage.current?.classList.add('visible');

    setInterval(() => {
      updateMessage.current?.classList.remove('visible');
    }, 5000);
  };

  const updateUserDetails = async (formData: Record<string, string>): Promise<void> => {
    try {
      const headers: Headers = new Headers();
      headers.set('content-type', 'application/json');
      headers.set('Accept', 'application/json');

      const formattedData: Omit<ApiUserData, 'createdDate'> = {
        firstName: formData["first-name"],
        lastName: formData["last-name"],
        email: formData["email"],
        company: formData["company"],
        country: formData["country"],
        phoneNumber: formData["phone-number"],
        profilePicture: formData["profile-picture"]
      };

      const request: Request = new Request('/api/user/update', {
        method: 'PUT',
        headers: headers,
        credentials: "include",
        body: JSON.stringify(formattedData)
      });

      const response = await fetch(request);

      if(response.ok) {
        const data: { message: string } = await response.json();
        updateMessageState(response.ok, '✅ Changes Saved');
        console.log(data.message);
      } else {
        throw new Error('An error occured attempting to update user details.');
      }
    } catch (error) {
      if (error instanceof Error) {
        updateMessageState(false, `❌ ${error.message}`);
        console.error(error.message);
      } else {
        updateMessageState(false, '❌ Unable to save changes. An Unexpected error occured');
        console.log(error);
      }
    }
  };

  const content = !editable ? (
    <ReadOnlyUserDetails
      data={userData}
      actions={{
        deactivateUser: deactivateUser,
        edit: toggleEditable,
        logout: logout
      }}
    />
  ) : (
    <>
      <EditableUserDetails 
        data={userData}
        actions={{
          back: backToProfile
        }}
        onSubmit={updateUserDetails}
      />
      <span ref={updateMessage} className="update-message">{userUpdateState.message}</span>
    </>
  );

  return (
    <div className="user-profile">
      {content}
    </div>
  );
};

export default UserProfile;