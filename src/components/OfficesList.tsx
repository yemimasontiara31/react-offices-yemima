import { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "react-query";
import { fetchOffices, deleteOffice, addOffice, AddOfficeBody, OfficesResponse, updateOffice } from "../mocks";
import AddOfficeForm from './AddOffice';
import EditOfficeForm from './EditOfficeForm';

import "./OfficeList.css";

const queryClient = new QueryClient();

const OfficesList = () => {
  const { data, isLoading, isError, refetch } = useQuery<OfficesResponse>("offices", fetchOffices, {
    refetchInterval: 1500,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [offices, setOffices] = useState<OfficesResponse["data"]>([]);
  // const [showEditForm, setShowEditForm] = useState(false);
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    // setShowEditForm(true);
    setEditingOfficeId(id);
  };
  
  const handleClearEditForm = () => {
    setEditingOfficeId(null);
  };

  const addOfficeMutation = useMutation(addOffice, {
    onSuccess: async () => {
      setShowSuccessMessage(true);
      setIsVisible(false);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    },
    onError: (error: any) => {
      console.error('Error adding office:', error);
    }
  });

  useEffect(() => {
    if (data) {
      console.log("Data yang diperoleh:", data);
      setOffices(data.data);
    }
  }, [data]);

  const handleSubmit = (data: AddOfficeBody) => {
    console.log(data);
    addOfficeMutation.mutate(data);
    refetch();
  };

  const handleClearSuccessMessage = () => {
    setShowSuccessMessage(false);
    setShowUpdateSuccessMessage(false);
  };

  const handleEditFormSubmit = async (data: AddOfficeBody): Promise<void> => {
    try {
      await updateOffice(editingOfficeId!, data);
      
      console.log('Data yang diubah:', data);
      
      setOffices(prevOffices =>
        prevOffices.map(office =>
          office.id === editingOfficeId
            ? { ...office, title: data.title, address: data.address, detail: { ...data } }
            : office
        )
      );
  
      setShowUpdateSuccessMessage(true);

      setTimeout(() => {
        setShowUpdateSuccessMessage(false);
      }, 5000);
    
      // setShowEditForm(false);
      setEditingOfficeId(null);
      setActiveId(null);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleDeleteOffice = async (id: string) => {
    try {
        const response = await deleteOffice(id);
        
        if (response && response.code === 200) {
            setShowSuccessMessage(true);
            console.log("Office deleted successfully!");
            
            await refetch();
            
            setOffices(prevOffices => prevOffices.filter(office => office.id !== id));

            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 5000);
        } else {
            console.error("Failed to delete office. Unexpected response:", response);
        }
    } catch (error) {
        console.error('Error deleting office:', error);
    }
  };

  const toggleActive = (id: string) => {
    setActiveId(prevId => (prevId === id ? null : id));
  };

  if (isLoading) return <div className='loading-error'>Loading...</div>;
  if (isError) return <div className='loading-error'>Error fetching data</div>;

  return (
    <div className="container">
      <div className="list-container">
        <h1>Offices</h1>

        <div className='add-loc'>
          <AddOfficeForm onSubmit={handleSubmit} isVisible={isVisible} />
        </div>

        <ul>
          {offices.map((office) => (
            <li key={office.id} className={office.id === activeId ? 'active' : ''}>
              {editingOfficeId === office.id ? (
                <EditOfficeForm
                  initialValues={{ ...office.detail, title: office.title, address: office.address }}
                  onSubmit={handleEditFormSubmit}
                  onClearForm={handleClearEditForm}
                  onSuccess={fetchOffices}
                />
              ) : (
                <>
                  <div className="card-title" onClick={() => toggleActive(office.id)}>
                    <div>
                      <h2>{office.title}</h2>
                      <p>{office.address}</p>
                    </div>
                    <span className="material-icons">
                      {office.id === activeId ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                  </div>

                  {office.id === activeId && (
                    <div className="card-details">
                      <p>{office.detail.fullname}</p>
                      <p>{office.detail.job}</p>
                      <p className="email">{office.detail.email}</p>
                      <p>{office.detail.phone}</p>

                      <div className='action'>
                        <button className='edit' onClick={() => handleEditClick(office.id)}>
                          <span className="material-icons">edit</span>
                          Edit
                        </button>
                        <button className='delete' onClick={() => handleDeleteOffice(office.id)}>
                          <span className="material-icons">delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showSuccessMessage && (
        <div className='success-msg'>
          <div className='text'>
            <span className="material-icons">check</span>
            <p>The location has been deleted.</p>
          </div>
          <span className="material-icons clear" onClick={handleClearSuccessMessage}>clear</span>
        </div>
      )}

      {showUpdateSuccessMessage && (
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


const OfficeListWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OfficesList />
    </QueryClientProvider>
  );
};

export default OfficeListWrapper;
