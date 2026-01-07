import type { Car, CarServices, Fueling } from '../types/garage.types';
import apiClient from './apiClient';

const ENDPOINT = '/cars';
const FUELING_ENDPOINT = '/fuelings';

export const fetchCars = async (userId: number | string): Promise<Car[]> => {
  const res = await apiClient.get<Car[]>(
    `${ENDPOINT}?userId=${userId}&_embed=fuelings`
  );
  return res.data;
};

export const createCar = async (
  carData: Omit<Car, 'id' | 'fuelings' | 'notes'>,
  userId: number | string
): Promise<Car> => {
  const res = await apiClient.post<Car>(ENDPOINT, {
    ...carData,
    userId,
  });
  return res.data;
};

export const updateCar = async (
  carId: number | string,
  data: Partial<Car>
): Promise<Car> => {
  const res = await apiClient.patch<Car>(`${ENDPOINT}/${carId}`, data);
  return res.data;
};

export const updateCarServices = async (
  carId: number | string,
  services: Partial<CarServices>
): Promise<Car> => {
  const res = await apiClient.patch<Car>(`${ENDPOINT}/${carId}`, { services });
  return res.data;
};

export const deleteCar = async (carId: number | string): Promise<void> => {
  await apiClient.delete(`${ENDPOINT}/${carId}`);
};

export const getFuelingByCarId = async (
  carId: number | string
): Promise<Fueling[]> => {
  const res = await apiClient.get<Fueling[]>(FUELING_ENDPOINT, {
    params: { carId },
  });
  return res.data;
};

export const createFueling = async (
  carId: number | string,
  data: Omit<Fueling, 'id' | 'carId'>
): Promise<Fueling> => {
  const res = await apiClient.post<Fueling>(FUELING_ENDPOINT, {
    ...data,
    carId,
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

export const updateFueling = async (
  fuelingId: number | string,
  data: Partial<Fueling>
): Promise<Fueling> => {
  const res = await apiClient.patch<Fueling>(
    `${FUELING_ENDPOINT}/${fuelingId}`,
    data
  );
  return res.data;
};

export const removeFueling = async (
  fuelingId: number | string
): Promise<void> => {
  await apiClient.delete(`${FUELING_ENDPOINT}/${fuelingId}`);
};
