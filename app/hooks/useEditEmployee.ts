import { useState, useEffect } from 'react';
import axios from 'axios'; 
const useEditEmployee = () => {
  const [editFetchLoading, setEditFetchLoading] = useState(true);
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [editError, setEditError] = useState(false);

  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editformData, setEditformData] = useState({
    user: {
      employeeNumber: "",
      name: "",
    },
    formula: "",
    projectedHour: 0
  });

  const fetchEmployeeDataByID = async (id: string) => {
    try {
      const res = await axios.get(`/api/employee/${id}`);
      if (res.status === 200) {
        setEditformData(res.data);
      } else if (res.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setEditFetchLoading(false);
    }
  };

  const editUserData = async () => {
    try {
      if (editEmployeeId !== "") {
        const res = await axios.put(`/api/employee/${editEmployeeId}`, editformData);
        if (res.status === 200) {
          setEditSuccess(true);
          setTimeout(() => {
            setEditSuccess(false);
          }, 3000);
        }
      }
      return true;
    } catch (error) {
      console.error('Error editing user data:', error);
      setEditError(true);
      return false;
    } finally {
      setEditLoading(false);
    }
  };




  return {
    
    editformData,
    editUserData,
    setEditformData,
    editError,
    fetchEmployeeDataByID,
    editSuccess,
    editLoading,
    editFetchLoading,
  };
};

export default useEditEmployee;
