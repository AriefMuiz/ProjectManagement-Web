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
        axiosInstance.get(`/public/project/list`, {
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

  async createProject(projectData) {
    return handleApiResponse(() => axiosInstance.post("/public/project/create", projectData));
  },

  /**
   * Get cost summary
   * @returns {Promise<Object>} Cost summary data
   */
  async getCostSummary() {
    return handleApiResponse(() => axiosInstance.get("/admin/projects/cost-summary"));
  },

  /**
   * Get project by ID
   * @param {string|number} id Project ID
   * @returns {Promise<Object>} Project details
   */
  async getProjectById(id) {
    return handleApiResponse(() => axiosInstance.get(`/admin/projects/${id}`));
  },


  /**
   * Get memo summary for all projects
   * @returns {Promise<Array>} Array of memo summary objects
   */
  async getMemoSummary() {
    return handleApiResponse(() => axiosInstance.get("/admin/projects/memo-summary"));
  },

  /**
   * Get cost detail for a specific project
   * @param {string|number} projectId Project ID
   * @returns {Promise<Object>} Cost detail data
   */
  async getCostDetail(projectId) {
    return handleApiResponse(() => axiosInstance.get(`/admin/projects/cost-detail?projectId=${projectId}`));
  },

  /**
   * Get consultants with bank details for a project
   * @param {string|number} projectId Project ID
   * @returns {Promise<Object>} Consultants with bank details
   */
  async getConsultantsWithBank(projectId) {
    return handleApiResponse(() => axiosInstance.get(`/admin/projects/consultants-with-bank?projectId=${projectId}`));
  },

  /**
   * Update existing project
   * @param {string|number} id Project ID
   * @param {Object} projectData Updated project data
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(id, projectData) {
    return handleApiResponse(() => axiosInstance.put(`/admin/projects/${id}`, projectData));
  },

  /**
   * Delete a project
   * @param {string|number} id Project ID
   * @returns {Promise<Object>} Response data
   */
  async deleteProject(id) {
    return handleApiResponse(() => axiosInstance.delete(`/admin/projects/${id}`));
  },

  /**
   * Update project status
   * @param {string|number} id Project ID
   * @param {string} status New status value
   * @returns {Promise<Object>} Response data
   */
  async updateProjectStatus(id, status) {
    return handleApiResponse(() => axiosInstance.patch(`/admin/projects/${id}/status`, { status }));
  }
};

export default projectsAPI;