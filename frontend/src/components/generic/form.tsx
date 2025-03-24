import '@/assets/css/form.css';
import { useCallback, useEffect, useRef, useState } from "react";

type InputTypes = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'password-confirm' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
export interface InputFieldSettings {
  name: string;
  type: InputTypes;
  required: boolean;
  group: string | 'none';
  preview?: boolean;
  defaultValue?: string;
  value?: string;
};
interface FormProps {
  action: string;
  method: 'GET' | 'POST' | null;
  target: '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop' | null;
  fields: InputFieldSettings[];
  buttonText: string;
  displayRequirements: boolean;
  onSubmit: (formData: Record<string, string>) => void;
};
interface RowProps {
  name: string;
  fields: InputFieldSettings[];
  passwordMatch: boolean;
  passwordVisible: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>, compareValue: string, confirmation: boolean) => void;
  toggleVisibility: () => void;
};
interface InputProps {
  settings: InputFieldSettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface PasswordProps {
  settings: InputFieldSettings;
  passwordMatch: boolean;
  visible: boolean;
  confirmation: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, compareValue: string, confirmation: boolean) => void;
  toggleVisibility: () => void;
}

function ShowIcon() {
  return (
    <svg className="password-visibility-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
  );
};
function HideIcon() {
  return (
    <svg className="password-visibility-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
  );
};

function Form(props: FormProps) {
  const initialiseFormDataStructure = (): Record<string, string> => {
    const data: Record<string, string> = {};
    props.fields.forEach(field => {
      if (field.value !== undefined) {
        data[field.name] = field.value;
      } else {
        data[field.name] = '';
      };
    });

    return data;
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>(initialiseFormDataStructure());
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validations, setValidations] = useState({
    containsLowercase: false,
    containsUppercase: false,
    containsNumber: false,
    containsSpecialChar: false,
    minLength: false,
    confirmationMatch: false
  });

  const checkFormValidity = useCallback(() => {
    if (!formRef.current) return; 
    const formValid = formRef.current.checkValidity();
    const requirePasswordValidation = props.fields.some(field => field.type === 'password' || field.type === 'password-confirm');
    const passwordValidated = requirePasswordValidation ?  Object.values(validations).every(criteria => criteria) : true;
    const isFormValid = formValid && passwordValidated;
  
    setIsFormValid(isFormValid);
  }, [validations]);
  
  useEffect(() => {
    checkFormValidity();
  }, [checkFormValidity]);

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const passwordValidation = (newPassword: string, confirmPassword: string, confirmation: boolean): void => {
    setValidations({
      containsLowercase: confirmation ? /[a-z]/.test(newPassword) : true,
      containsUppercase: confirmation ? /[A-Z]/.test(newPassword) : true,
      containsNumber: confirmation ? /\d/.test(newPassword) : true,
      containsSpecialChar: confirmation ? /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) : true,
      minLength: confirmation ? newPassword.length >= 8 : true,
      confirmationMatch: confirmation ? !!newPassword && newPassword === confirmPassword : true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    checkFormValidity();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, compareValue: string, confirmation: boolean): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (!confirmation) {
      passwordValidation(e.target.value, e.target.value, confirmation);
    } else if (e.target.name === 'password-confirmation') {
      passwordValidation(compareValue, e.target.value, confirmation);
    } else {
      passwordValidation(e.target.value, compareValue, confirmation);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    props.onSubmit(formData);
  };

  const formAttributes: Record<string, string> = {};
  if (props.action !== '') formAttributes.action = props.action;
  if (props.method !== null) formAttributes.method = props.method;
  if (props.target !== null) formAttributes.target = props.target;

  const rows: Record<string, InputFieldSettings[]> = props.fields.reduce<Record<string, InputFieldSettings[]>>((acc, field) => {
    const { group } = field;
    let newGroup = group;
    if (newGroup === '') newGroup = 'none';
    if (!acc[newGroup]) acc[newGroup] = [];
    acc[newGroup].push(field);
    
    return acc;
  }, {} as Record<string, InputFieldSettings[]>);

  const requirements = (
    <div className="validation-messages">
      <div className="password-validation"> 
        <span>Your password must meet the following criteria:</span>
        <ul>
          <li className="valid-char-leng"><span className="is-valid">{validations.minLength ? '✅' : '❌'}</span> A minimum of 8 characters in length</li>
          <li className="valid-lowercase"><span className="is-valid">{validations.containsLowercase ? '✅' : '❌'}</span> At least one lowercase letter (a-z)</li>
          <li className="valid-uppercase"><span className="is-valid">{validations.containsUppercase ? '✅' : '❌'}</span> At least one uppercase letter (A-Z)</li>
          <li className="valid-number">   <span className="is-valid">{validations.containsNumber ? '✅' : '❌'}</span> At least one number digit (0-9)</li>
          <li className="valid-spec-char"><span className="is-valid">{validations.containsSpecialChar ? '✅' : '❌'}</span> At least one special character (e.g. @, #, $, %, &)</li>
          <li className="valid-confirmation"><span className="is-valid">{validations.confirmationMatch ? '✅' : '❌'}</span> Confirmation Password must match New Password</li>
        </ul> 
      </div>
    </div>
  );

  return (
    <form id="customisable-form" ref={formRef} {...formAttributes} onChange={checkFormValidity} onSubmit={handleFormSubmit}>
      {Object.entries(rows).map(([key, value]) => (
        <Row 
          key={key} 
          name={key} 
          fields={value} 
          passwordMatch={validations.confirmationMatch} 
          passwordVisible={isPasswordVisible}
          onInputChange={handleInputChange} 
          onPasswordChange={handlePasswordChange} 
          toggleVisibility={togglePasswordVisibility}
        />
      ))}
      {props.displayRequirements && Object.values(validations).includes(false) && requirements}
      <button disabled={!isFormValid}>{props.buttonText}</button>
    </form>
  );
};

function Row(props: RowProps) {
  if (props.name === 'none') {
    return (
      <>
        {props.fields.map((field) => field.type.includes('password') ? (
          <PasswordField 
            key={field.name} 
            settings={field}
            passwordMatch={props.passwordMatch}
            visible={props.passwordVisible}
            confirmation={field.type.includes('confirm') ? true : false}
            onChange={props.onPasswordChange}
            toggleVisibility={props.toggleVisibility} 
          />
        ) : (
          <Field key={field.name} settings={field} onChange={props.onInputChange} />
        ))}
      </>
    );
  } else {
    return (
      <div key={props.name} className={`row ${props.name}`}>
        {props.fields.map((field) => field.type.includes('password') ? (
          <PasswordField
            key={field.name}
            settings={field}
            passwordMatch={props.passwordMatch}
            visible={props.passwordVisible}
            confirmation={field.type.includes('confirm') ? true : false}
            onChange={props.onPasswordChange}
            toggleVisibility={props.toggleVisibility} 
          />
        ) : (
          <Field key={field.name} settings={field} onChange={props.onInputChange} />
        ))}
      </div>
    );
  }
};

function Field(props: InputProps) {
  const previewInput = useRef<HTMLInputElement>(null);
  const attributes: Record<string, string | RegExp | boolean> = {};
  attributes.id = `i-${props.settings.name}`;
  attributes.name = props.settings.name;
  attributes.placeholder = " ";
  attributes.type = props.settings.type;
  attributes.required = props.settings.required;
  if (props.settings.value) attributes.defaultValue = props.settings.value;

  const validationMessages = (
    <span className="required-field-message">{props.settings.name.replace('-', ' ')} must be populated.</span>
  );

  const previewImage = previewInput.current?.value ? previewInput.current?.value : props.settings.defaultValue;

  const previewEnabledInput = (
    <div className="preview-field">
      <div className="preview-image" style={{ backgroundImage: `url(${previewImage})` }}></div>
      <div className="field-wrapper">
        <label htmlFor={ `i-${props.settings.name}`}>{props.settings.name.replace('-', ' ')} {props.settings.required ? <span className="required">*</span> : ''}</label>
        <input
          ref={previewInput}
          key={props.settings.name}
          onChange={props.onChange}
          {...attributes}
        />
        {props.settings.required && validationMessages}
      </div>
    </div>
  );

  const inputElement = (
    <div className="field-wrapper">
      <label htmlFor={ `i-${props.settings.name}`}>{props.settings.name.replace('-', ' ')} {props.settings.required ? <span className="required">*</span> : ''}</label>
      <input
        key={props.settings.name}
        onChange={props.onChange}
        {...attributes}
      />
      {props.settings.required && validationMessages}
    </div>
  );

  return props.settings.preview ? previewEnabledInput : inputElement;
};

function PasswordField(props: PasswordProps) {
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const attributes: Record<string, string | RegExp | boolean> = {};
  attributes.placeholder = " ";
  attributes.type = props.visible ? "text" : props.settings.type.split('-')[0];
  if (props.confirmation) attributes.pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$";
  attributes.required = props.settings.required;

  const validationMessages = (
    <span className="required-field-message">{props.settings.name.replace('-', ' ')} must be populated and meet the requirements below.</span>
  );

  const inputElement = (
    <div className="field-wrapper">
      <label htmlFor={ `i-${props.settings.name}`}>{props.settings.name.replace('-', ' ')} {props.settings.required ? <span className="required">*</span> : ''}</label>
      <input
        id={`i-${props.settings.name}`}
        name={props.settings.name}
        ref={newPasswordRef}
        key={props.settings.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e, confirmPasswordRef.current?.value ? confirmPasswordRef.current.value : '', props.confirmation)}
        {...attributes}
      />
      {props.settings.required && validationMessages}
    </div>
  );
  const confirmationElement = (
    <div className="field-wrapper">
      <label htmlFor={ `i-password-confirmation`}>Confirm password {props.settings.required ? <span className="required">*</span> : ''}</label>
      <input
        ref={confirmPasswordRef}
        id="i-password-confirmation"
        key="password-confirmation"
        name="password-confirmation"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e, newPasswordRef.current?.value ? newPasswordRef.current.value : '', props.confirmation)}
        {...attributes}
      required />
      {props.settings.required && validationMessages}
    </div>
  );

  return (
    <div className="password-confirmation-fields">
      <div className="password-wrapper" key={`password-wrapper-${props.settings.name}`}>
        {inputElement}
        <div className="password-visibility-button" onClick={props.toggleVisibility}>{ props.visible ? <HideIcon /> : <ShowIcon /> }</div>
      </div>
      { props.confirmation ? <div className="password-wrapper" key="password-confirmation-wrapper-password-confirmation">
        {confirmationElement}
        <div className="password-matches">{props.passwordMatch ? '✅' : '❌'}</div>
      </div> : ''}
    </div>
  );
};

export default Form;