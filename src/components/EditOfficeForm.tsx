import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddOfficeBody } from '../mocks';
import "./AddEditOffice.css";

interface EditOfficeFormProps {
  initialValues: AddOfficeBody;
  onSubmit: (data: AddOfficeBody) => Promise<void>;
  onClearForm: () => void;
  onSuccess: () => void;
} 

const EditOfficeForm: React.FC<EditOfficeFormProps> = ({ initialValues, onSubmit, onClearForm, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddOfficeBody>({ defaultValues: initialValues });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFormSubmit = async (data: AddOfficeBody) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onSuccess();
      setShowSuccessMessage(true);
      reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div>
      <div className='card-add-loc'>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className='top-add'>
            <h3>Edit Location</h3>
            <span className="material-icons" onClick={onClearForm}>clear</span>
          </div>

          <div className='input-add'>
              <label>Title <span>*</span></label>
              <input type="text" className={errors.title ? 'error' : ''} {...register("title", { required: true })}/>
              {errors.title && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <div className='input-add'>
              <label>Enter the address <span>*</span></label>
              <input type="text" className={errors.address ? 'error' : ''} {...register("address", { required: true })} />
              {errors.address && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <div className='contact-info'>
              <p>CONTACT INFORMATION</p>
          </div>

          <div className='input-add'>
              <label>Full Name <span>*</span></label>
              <input type="text" className={errors.fullname ? 'error' : ''} {...register("fullname", { required: true })} />
              {errors.fullname && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <div className='input-add'>
              <label>Job Position <span>*</span></label>
              <input type="text" className={errors.job ? 'error' : ''} {...register("job", { required: true })} />
              {errors.job && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <div className='input-add'>
              <label>Email address <span>*</span></label>
              <input type="email" className={errors.email ? 'error' : ''} {...register("email", { required: true })} placeholder="name@example.com" />
              {errors.email && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <div className='input-add'>
              <label>Phone <span>*</span></label>
              <input 
                  type="tel" 
                  className={errors.phone ? 'error' : ''} 
                  {...register("phone", { required: true })} 
                  placeholder="(xxx) xxx-xxxx" 
                  maxLength={14} 
              />
              {errors.phone && (
                <span className="error">
                    This field cannot be empty
                    <span className="material-icons">error</span>
                </span>
              )}
          </div>

          <button className='submit-edit' type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>

      {showSuccessMessage && (
        <div className='success-msg'>
          <div className='text'>
            <span className="material-icons">check</span>
            <p>The location has been updated.</p>
          </div>
          <span className="material-icons clear" onClick={handleClearSuccessMessage}>clear</span>
        </div>
      )}
    </div>
  );
};

export default EditOfficeForm;
