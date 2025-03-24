import type { InputFieldSettings } from '@/components/generic/form';
import type { UserData } from "@/components/user/user";
import Form from "@/components/generic/form";
import defaultProfilePicture from "@/assets/img/default-profile-image.png";

interface EditProfileProps {
  data: UserData;
  actions: Record<string, () => Promise<void>>;
  onSubmit: (formData: Record<string, string>) => void;
};

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
  );
};

function EditableUserDetails(props: EditProfileProps) {
  const fields: InputFieldSettings[] = [
    { name: 'profile-picture', required: false, type: "url", group: '', preview: true, defaultValue: defaultProfilePicture, value: props.data['profile-picture'] },
    { name: 'first-name', required: true, type: "text", group: '', value: props.data['first-name'] },
    { name: 'last-name', required: true, type: "text", group: '', value: props.data['last-name'] },
    { name: 'email', required: true, type: "email", group: '', value: props.data['email'] },
    { name: 'company', required: false, type: "text", group: '', value: props.data['company'] },
    { name: 'country', required: false, type: "text", group: '', value: props.data['country'] },
    { name: 'phone-number', required: false, type: "text", group: '', value: props.data['phone-number'] },
  ];

  return (
    <>
      <div className="user-profile-header">
        <div className="header-action-button left back" onClick={props.actions.back}>
          <BackIcon />
        </div>
        <div className="title right">
          <h2>Update Information</h2>
        </div>
      </div>
      <Form 
        action=''
        method={null}
        target={null}
        buttonText="Save"
        fields={fields}
        displayRequirements={false}
        onSubmit={props.onSubmit}
      />
    </>
  );
};

export default EditableUserDetails;