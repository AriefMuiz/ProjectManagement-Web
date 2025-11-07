import {axiosInstance, handleApiResponse} from "../axiosConfig.js";

const clientAPI = {
/**
 * Get list of all Sustainable Development Goals with caching
 * @returns {Promise<Array>} Transformed SDG list
 */
async getClientList() {
    return handleApiResponse(async () => {
        const response = await axiosInstance.get("public/client/list");
        return response?.data;
    });
}
};


export default clientAPI;