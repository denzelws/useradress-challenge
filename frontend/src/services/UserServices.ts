import { api } from "./api";

export interface User {
  id?: number;
  name: string;
  cpf: string;
  birthDate: string;
  password: string;
  role?: string;
}

export const UserService = {
  login: async (credentials: {
    cpf: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post<User>("/users/login", credentials);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: User): Promise<User> => {
    const userToCreate = {
      ...user,
      role: user.role || "USER",
    };

    const response = await api.post<User>("/users", userToCreate);
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
