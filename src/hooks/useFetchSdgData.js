// src/hooks/useFetchSdgData.js
import {useEffect, useState} from "react";
import sdgAPI from "../fetch/common/sdg";


const useFetchSdgData = () => {
    const [sdgOptions, setSdgOptions] = useState([]);
    const [isLoadingSdg, setIsLoadingSdg] = useState(true);

    useEffect(() => {
        const fetchSdgData = async () => {
            setIsLoadingSdg(true);
            try {
                const transformedData = await sdgAPI.getSdgList();

                setSdgOptions(transformedData);
            } catch (error) {
                console.error("Failed to fetch SDG data:", error);
            } finally {
                setIsLoadingSdg(false);
            }
        };

        fetchSdgData();
    }, []);

    return {sdgOptions, isLoadingSdg};
};

export default useFetchSdgData;