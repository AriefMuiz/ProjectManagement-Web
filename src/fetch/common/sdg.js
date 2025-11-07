import axiosInstance, { handleApiResponse } from "../axiosConfig.js";


// API endpoint constants
const API_PATHS = {
    LIST: "public/sdg-goals/list"
};


const sdgAPI = {
    /**
     * Get list of all Sustainable Development Goals with caching
     * @returns {Promise<Array>} Transformed SDG list
     */
    async getSdgList() {
        return handleApiResponse(async () => {
            const response = await axiosInstance.get(API_PATHS.LIST);
            return response?.data;
        });
    }
};


export default sdgAPI;