import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetchOffices, addOffice, AddOfficeBody } from '../mocks'; // Import addOffice from mocks
import "./AddEditOffice.css";

interface AddOfficeFormProps {
    onSubmit: (data: AddOfficeBody) => void;
    isVisible: boolean;
}

const AddOfficeForm: React.FC<AddOfficeFormProps> = ({ isVisible }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddOfficeBody>();
  const [showForm, setShowForm] = useState(isVisible);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleClearClick = () => {
    setShowForm(false);
    setShowSuccessMessage(false);
  };

  const handleClearSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleFormSubmit: SubmitHandler<AddOfficeBody> = async (data) => {
    try {
      await addOffice(data);

      console.log(data);
      
      const updatedOffices = await fetchOffices();
  
      console.log(updatedOffices);
      
      setShowForm(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error while adding office:', error);
    }
  };
  
  return (
    <div>
        {showForm ? (

        <div className='card-add-loc'>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className='top-add'>
                    <h3>New Location</h3>
                    <span className="material-icons" onClick={handleClearClick}>clear</span>
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

                <button className='submit-save' type="submit">Save</button>
            </form>
        </div>  

        ) : (
            <div className='add-loc'>
            <button onClick={() => setShowForm(true)}>
                Add New Location
                <span className="material-icons">add</span>
            </button>
            </div>
        )}
        
        {showSuccessMessage && (
          <div className='success-msg'>
            <div className='text'>
              <span className="material-icons">check</span>
              <p>The location has been added.</p>
            </div>
            <span className="material-icons clear" onClick={handleClearSuccessMessage}>clear</span>
          </div>
        )}
    </div>
  );
};

export default AddOfficeForm;
