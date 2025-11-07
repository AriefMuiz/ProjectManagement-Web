import axiosInstance, { handleApiResponse } from "../axiosConfig.js";

const consultantAPI = {
/**
 * Get list of all Sustainable Development Goals with caching
 * @returns {Promise<Array>} Transformed SDG list
 */
async getConsultantList() {
    return handleApiResponse(async () => {
        const response = await axiosInstance.get("public/consultant/list");
        return response?.data;
    });
}
};


export default consultantAPI;