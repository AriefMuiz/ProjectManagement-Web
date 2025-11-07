// src/fetch/admin/projects.js
import axiosInstance, { handleApiResponse } from "../axiosConfig.js";

/**
 * Projects API service for admin functions
 */
const projectsAPI = {
  /**
   * Get all projects
   * @returns {Promise<Object>} Projects list with metadata
   */
  async getAllProjects({
                         page = 1,
                         pageSize = 5,
                         search = "",
                         status = "all",
                       } = {}) {
    return handleApiResponse(() =>
        axiosInstance.get(`/admin/project/list`, {
          params: {
            "page": page,
            "page-size": pageSize,
            "search": search,
            "status": status !== "all" ? status : undefined
          },
          headers: { accept: "*/*" },
        })
    );
  },

  /**
   * Get cost summary
   * @returns {Promise<Object>} Cost summary data
   */
  async getCostSummary() {
    return handleApiResponse(() => axiosInstance.get("/admin/project/payment-report"));
  },

  /**
   * Get project by ID
   * @param {string|number} id Project ID
   * @returns {Promise<Object>} Project details
   */
  async getProjectById(id) {
    return handleApiResponse(() => axiosInstance.get(`/admin/project/${id}`));
  },

  /**
   * Create new project
   * @param {Object} projectData Project data
   * @returns {Promise<Object>} Created project
   */
  async createProject(projectData) {
    return handleApiResponse(() => axiosInstance.post("/admin/project/create", projectData));
  },

  /**
   * Get memo summary for all projects
   * @returns {Promise<Array>} Array of memo summary objects
   */
  async getMemoSummary() {
    return handleApiResponse(() => axiosInstance.get("/admin/project/memo-summary"));
  },

  /**
   * Get cost detail for a specific project
   * @param {string|number} projectId Project ID
   * @returns {Promise<Object>} Cost detail data
   */
  async getCostDetail(projectId) {
    return handleApiResponse(() => axiosInstance.get(`/admin/project/cost-detail?projectId=${projectId}`));
  },

  /**
   * Get consultants with bank details for a project
   * @param {string|number} projectId Project ID
   * @returns {Promise<Object>} Consultants with bank details
   */
  async getConsultantsWithBank(projectId) {
    return handleApiResponse(() => axiosInstance.get(`/admin/project/consultants-with-bank?projectId=${projectId}`));
  },

  /**
   * Update existing project
   * @param {string|number} id Project ID
   * @param {Object} projectData Updated project data
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(id, projectData) {
    return handleApiResponse(() => axiosInstance.put(`/admin/project/${id}`, projectData));
  },

  /**
   * Delete a project
   * @param {string|number} id Project ID
   * @returns {Promise<Object>} Response data
   */
  async deleteProject(id) {
    return handleApiResponse(() => axiosInstance.delete(`/admin/project/${id}`));
  },

  /**
   * Update project status
   * @param {string|number} id Project ID
   * @param {string} status New status value
   * @returns {Promise<Object>} Response data
   */
  async updateProjectStatus(id, status) {
    return handleApiResponse(() => axiosInstance.patch(`/admin/project/${id}/status`, { status }));
  }
};

export default projectsAPI;