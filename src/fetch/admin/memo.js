// src/fetch/admin/memo.js
import axiosInstance, { handleApiResponse } from "../axiosConfig.js";
const memoAPI = {
    /**
     * Create a new memo
     * @param {Object} memoData
     * @returns {Promise<Object>}
     */
    async createMemo(memoData) {
        return handleApiResponse(() => axiosInstance.post("/admin/memo", memoData));
    },


    /**
     * Get memo by ID
     * @param {string|number} memoId
     * @returns {Promise<Object>}
     */
    async getMemoById(memoId) {
        return handleApiResponse(() => axiosInstance.get(`/admin/memo/${memoId}`));
    },

    /**
     * Get all memos for a project
     * @param {string|number} projectId
     * @returns {Promise<Array>}
     */
    async getMemosByProject(projectId) {
        return handleApiResponse(() => axiosInstance.get(`/admin/memo/project/${projectId}`));
    },

    /**
     * Mark a memo as paid
     * @param {string|number} memoId
     * @returns {Promise<Object>}
     */
    async markAsPaid(memoId) {
        return handleApiResponse(() => axiosInstance.put(`/admin/memo/${memoId}/pay`));
    },
};

export default memoAPI;