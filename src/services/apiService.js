import api from "./api";

export const apiService = {
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },
};
