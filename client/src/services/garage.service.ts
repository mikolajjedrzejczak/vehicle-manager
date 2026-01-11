import type {
  Car,
  CarServices,
  CreateCarData,
  Fueling,
  Stats,
} from '../types/garage.types';
import apiClient from './apiClient';

const ENDPOINT = '/cars';
const FUELING_ENDPOINT = '/fuelings';

export const fetchCars = async (): Promise<Car[]> => {
  const res = await apiClient.get<Car[]>(`${ENDPOINT}`);
  return res.data;
};

export const createCar = async (carData: CreateCarData): Promise<Car> => {
  const res = await apiClient.post<Car>(ENDPOINT, carData);
  return res.data;
};

export const updateCar = async (
  carId: number | string,
  data: Partial<Car>
): Promise<Car> => {
  const res = await apiClient.put<Car>(`${ENDPOINT}/${carId}`, data);
  return res.data;
};

export const updateCarServices = async (
  carId: number | string,
  services: Partial<CarServices>
): Promise<Car> => {
  const res = await apiClient.put<Car>(`${ENDPOINT}/${carId}`, { services });
  return res.data;
};

export const deleteCar = async (carId: number | string): Promise<void> => {
  await apiClient.delete(`${ENDPOINT}/${carId}`);
};

export const getCarStats = async (carId: string | number): Promise<Stats> => {
  const response = await apiClient.get<Stats>(`/cars/${carId}/stats`);
  return response.data;
};

export const getFuelingByCarId = async (
  carId: number | string
): Promise<Fueling[]> => {
  const res = await apiClient.get<Fueling[]>(`${FUELING_ENDPOINT}/car/${carId}`);
  return res.data;
};

export const createFueling = async (
  carId: number | string,
  data: Omit<Fueling, 'id' | 'carId' | 'createdAt'>
): Promise<Fueling> => {
  const payload = {
    ...data,
    carId: Number(carId),
  };

  const res = await apiClient.post<Fueling>(FUELING_ENDPOINT, payload);
  return res.data;
};

export const updateFueling = async (
  id: number | string,
  data: Omit<Fueling, 'id' | 'carId' | 'createdAt'>
): Promise<Fueling> => {
  const payload = {
    ...data,
    carId: 0,
  };

  const res = await apiClient.put<Fueling>(`/fuelings/${id}`, payload);
  return res.data;
};

export const deleteFueling = async (id: number | string): Promise<void> => {
  await apiClient.delete(`/fuelings/${id}`);
};
