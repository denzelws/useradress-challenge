import { api } from "./api";

export interface Address {
  id?: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isMainAddress: boolean;
}

export const AddressService = {
  getAllGlobal: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>("/addresses");
    return response.data;
  },

  getAllByUserId: async (userId: number): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/users/${userId}/addresses`);
    return response.data;
  },

  create: async (userId: number, address: Address): Promise<Address> => {
    const response = await api.post<Address>(
      `/users/${userId}/addresses`,
      address,
    );
    return response.data;
  },

  update: async (
    userId: number,
    addressId: number,
    address: Address,
  ): Promise<Address> => {
    const response = await api.put<Address>(
      `/users/${userId}/addresses/${addressId}`,
      address,
    );
    return response.data;
  },

  delete: async (userId: number, addressId: number): Promise<void> => {
    await api.delete(`/users/${userId}/addresses/${addressId}`);
  },
};
