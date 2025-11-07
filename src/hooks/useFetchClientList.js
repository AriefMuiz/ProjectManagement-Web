// src/hooks/useFetchClientList.js
import { useState, useEffect } from 'react';
import {clientAPI} from "../fetch/common/index.js";

const useFetchClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getClientList();
          setClients(response);
      } catch (error) {
          setError(error.message);
          console.error("Failed to fetch SDG data:", error);
      } finally {
          setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return { clients, loading, error };
};

export default useFetchClientList;