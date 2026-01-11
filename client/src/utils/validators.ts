import type { LoginBody } from '../types/auth.types';
import type { Car, Fueling } from '../types/garage.types';

interface AuthFields extends LoginBody {
  confirmPassword?: string;
}

type AllPosibleFields = AuthFields &
  Car &
  Omit<Fueling, 'id' | 'carId' | 'createdAt'>;

export type ValidationErrors = Partial<Record<keyof AllPosibleFields, string>>;

export const validateLogin = (data: LoginBody) => {
  const errors: ValidationErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email.trim()) {
    errors.email = 'Email jest wymagany!';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Niepoprawny format adresu email!';
  }

  if (!data.password) {
    errors.password = 'Hasło jest wymagane!';
  }

  return errors;
};

export const validateRegister = (data: AuthFields) => {
  const errors: ValidationErrors = validateLogin(data);

  if (data.password.length < 6) {
    errors.password = 'Hasło musi mieć co najmniej 6 znaków!';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Hasła nie są identyczne!';
  }

  return errors;
};

export const validateCar = (data: Omit<Car, 'id'>) => {
  const errors: ValidationErrors = {};

  if (!data.brand?.trim()) errors.brand = 'Marka jest wymagana!';
  if (!data.model?.trim()) errors.model = 'Model jest wymagany!';

  const backendRegex = /^[A-Z]{2,3}\s?[A-Z0-9]{4,5}$/i;

  if (!data.registrationNumber?.trim()) {
    errors.registrationNumber = 'Nr rejestracyjny jest wymagany!';
  } else if (
    data.registrationNumber.trim().length < 4 ||
    data.registrationNumber.trim().length > 9
  ) {
    errors.registrationNumber =
      'Numer rejestracyjny musi mieć od 4 do 9 znaków';
  } else if (!backendRegex.test(data.registrationNumber.trim())) {
    errors.registrationNumber = 'Niepoprawny format (np. PO 12345 lub WN1234A)';
  }

  const currentYear = new Date().getFullYear();
  const yearNum = Number(data.year);

  if (!data.year || yearNum < 1970 || yearNum > currentYear + 1) {
    errors.year = `Rok musi być między 1970 a ${currentYear + 1}!`;
  }

  if (
    data.mileage === undefined ||
    data.mileage === null ||
    String(data.mileage).trim() === ''
  ) {
    errors.mileage = 'Przebieg jest wymagany!';
  } else if (isNaN(Number(data.mileage)) || Number(data.mileage) < 0) {
    errors.mileage = 'Podaj poprawny przebieg!';
  }

  if (data.vin && data.vin.length !== 17) {
    errors.vin = 'VIN musi mieć 17 znaków!';
  }

  return errors;
};

export const validateFueling = (
  data: Omit<Fueling, 'id' | 'cardId' | 'createdAt'>,
  lastCarMileage: number
) => {
  const errors: ValidationErrors = {};

  if (!data.date) errors.date = 'Data jest wymagana!';

  if (
    data.mileage === undefined ||
    data.mileage === null ||
    String(data.mileage).trim() === ''
  ) {
    errors.mileage = 'Przebieg jest wymagany!';
  } else if (isNaN(Number(data.mileage)) || Number(data.mileage) < 0) {
    errors.mileage = 'Podaj poprawny przebieg!';
  } else if (data.mileage < lastCarMileage) {
    errors.mileage = `Przebieg nie może być mniejszy niż ostatni (${lastCarMileage.toLocaleString()} km)!`;
  }

  if (!data.liters || Number(data.liters) <= 0)
    errors.liters = 'Wpisz ilość paliwa!';
  if (!data.cost || Number(data.cost) <= 0) errors.cost = 'Wpisz koszt!';

  return errors;
};
