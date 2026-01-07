import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Car, Fueling } from '../types/garage.types';
import {
  createFueling,
  removeFueling,
  fetchCars,
  updateFueling,
  getFuelingByCarId,
  updateCar,
} from '../services/garage.service';

type FuelingCreateData = Omit<Fueling, 'id' | 'carId'>;

interface GarageState {
  cars: Car[];
  currentCarId: number | string | null;
  isLoading: boolean;
  error: string | null;

  setCars: (cars: Car[]) => void;
  setCurrentCar: (carId: number | string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  fetchUserCars: (userId: number | string) => Promise<void>;
  addCarToState: (car: Car) => void;
  getCurrentCar: () => Car | null;

  fetchCurrentCarFuelings: () => Promise<void>;
  addFueling: (data: FuelingCreateData) => Promise<void>;
  updateFueling: (
    fuelingId: number | string,
    data: FuelingCreateData
  ) => Promise<void>;
  deleteFueling: (fuelingId: number | string) => Promise<void>;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      cars: [],
      currentCarId: null,
      isLoading: false,
      error: null,

      setCars: (cars) => set({ cars }),
      setCurrentCar: (carId) => set({ currentCarId: carId }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      fetchUserCars: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const cars = await fetchCars(userId);
          set({ cars, isLoading: false });
        } catch (err) {
          console.error(err);
          set({
            error: 'Nie udało się pobrać listy pojazdów.',
            isLoading: false,
          });
        }
      },

      addCarToState: (car) =>
        set((state) => ({
          cars: [...state.cars, { ...car, fuelings: [] }],
          currentCarId: car.id,
        })),

      getCurrentCar: () => {
        const { cars, currentCarId } = get();
        if (!currentCarId) return cars[0] || null;
        return cars.find((c) => c.id === currentCarId) || cars[0] || null;
      },

      fetchCurrentCarFuelings: async () => {
        const carId = get().currentCarId;
        if (!carId) return;

        set({ isLoading: true });
        try {
          const fuelings = await getFuelingByCarId(carId);

          set((state) => ({
            isLoading: false,
            cars: state.cars.map((car) =>
              car.id === carId ? { ...car, fuelings } : car
            ),
          }));
        } catch (err) {
          set({ error: 'Nie udało się pobrać tankowań', isLoading: false });
        }
      },
      addFueling: async (
        fuelingData: Omit<Fueling, 'id' | 'carId' | 'createdAt'>
      ) => {
        const { currentCarId, cars } = get();

        if (!currentCarId) {
          console.error('Błąd: Próba dodania tankowania bez wybranego auta');
          return;
        }

        const currentCar = cars.find((c) => c.id === currentCarId);
        if (!currentCar) return;

        set({ isLoading: true });
        try {
          const newFueling = await createFueling(currentCarId, fuelingData);

          let updatedCar = { ...currentCar };

          if (fuelingData.mileage > currentCar.mileage) {
            await updateCar(currentCarId, {
              mileage: fuelingData.mileage,
            });

            updatedCar.mileage = Number(fuelingData.mileage);
          }

          set((state) => ({
            cars: state.cars.map((car) =>
              car.id === currentCarId
                ? {
                    ...updatedCar,
                    fuelings: [...(car.fuelings || []), newFueling],
                  }
                : car
            ),
            isLoading: false,
          }));
        } catch (err) {
          console.error('Store: Błąd dodawania tankowania', err);
          set({ isLoading: false, error: 'Nie udało się dodać tankowania' });
          throw err;
        }
      },

      updateFueling: async (fuelingId, data) => {
        const carId = get().currentCarId || get().cars[0]?.id;
        if (!carId) return;

        try {
          const updated = await updateFueling(fuelingId, data);
          set((state) => ({
            cars: state.cars.map((car) =>
              car.id === carId
                ? {
                    ...car,
                    fuelings: (car.fuelings || []).map((f) =>
                      f.id === fuelingId ? updated : f
                    ),
                  }
                : car
            ),
          }));
        } catch (err) {
          console.error('Store: Błąd edycji tankowania', err);
          throw err;
        }
      },

      deleteFueling: async (fuelingId) => {
        const carId = get().currentCarId || get().cars[0]?.id;
        if (!carId) return;

        try {
          await removeFueling(fuelingId);

          set((state) => ({
            cars: state.cars.map((car) =>
              car.id === carId
                ? {
                    ...car,
                    fuelings: (car.fuelings || []).filter(
                      (f) => f.id !== fuelingId
                    ),
                  }
                : car
            ),
          }));
        } catch (err) {
          console.error('Store: Błąd usuwania tankowania', err);
          set({ error: 'Nie udało się usunąć wpisu' });
          throw err;
        }
      },
    }),
    {
      name: 'garage-storage',
      partialize: (state) => ({ currentCarId: state.currentCarId }),
    }
  )
);
