
import { axiosInstance, handleApiResponse } from "../axiosConfig.js";

/**
 * Projects API service for admin functions
 */
const memosAPI = {
  /**
   * Get all projects
   * @returns {Promise<Object>} Projects list with metadata
   */
  async getAllMemos({
                         page = 1,
                         pageSize = 5,
                         search = "",
                       } = {}) {
    return handleApiResponse(() =>
        axiosInstance.get(`/public/project-memo/project-list`, {
          params: {
            "page": page,
            "page-size": pageSize,
            "search": search
          },
          headers: { accept: "*/*" },
        })
    );
  },


};

export default memosAPI;