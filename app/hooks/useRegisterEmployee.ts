import { useState, useEffect } from 'react';
import validateFormula from '@/lib/validateFormula'
import axios from 'axios'

const useRegisterEmployee = (initialFormData = {}) => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    name: "",
    formula:"",
    projectedHour:0,
    password:""
  });

  const [saveError, setSaveError] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveUserData = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(!validateFormula(formData.formula)){
        setSaveError(true)
        setSaveErrorMessage("Invalid Formula")
        setTimeout(() => {
          setSaveError(false);
        }, 5000);
        return  
      }

      const res = await axios.post("/api/register", formData);
      if (res.status === 201) {
        setFormData({
          employeeNumber: "",
          name: "",
          formula:"",
          projectedHour:0,
          password:""
        });
        setSuccess(true);
        setTimeout(() => {
        setSuccess(false);
      }, 5000);
      } 
      else if(res.status === 400){
        setSaveError(true)
        setSaveErrorMessage(res.data.message);
        setTimeout(() => {
          setSaveError(false);
        }, 5000);
      }
    } catch (e: any) {
      if(e.response.status === 400){
        setSaveError(true)
        setSaveErrorMessage(e.response.data.message);
        setTimeout(() => {
          setSaveError(false);
        }, 5000);
      }else{
      setSaveError(true)
      setSaveErrorMessage("Something went wrong");
      setTimeout(() => {
        setSaveError(false);
      }, 5000);
    }
    } finally {
      setLoading(false);
    }
  };


  return {
    formData,
    setFormData,
    saveError,
    saveErrorMessage,
    success,
    loading,
    saveUserData,
  };
};

export default useRegisterEmployee;
