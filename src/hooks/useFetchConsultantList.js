// src/hooks/useFetchConsultantList.js
import { useState, useEffect } from 'react';
import consultantAPI from "../fetch/common/consultant.js";

const useFetchConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await consultantAPI.getConsultantList();
        setConsultants(response);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch consultant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  return { consultants, loading, error };
};

export default useFetchConsultantList;