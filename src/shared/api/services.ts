import { User } from '../../entities/user';
import { API_ENDPOINTS } from './endpoints';
import { apiClient } from './httpClient';

export const usersApi = {
  async getUser(id: number) {
    return apiClient.get<User>(API_ENDPOINTS.USERS.GET(id));
  },

  async getUsersList() {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
  },
};
