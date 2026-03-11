import { api } from "./api";

export interface User {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
}

export const UserService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: User): Promise<User> => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },

  update: async (id: number, user: User): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
