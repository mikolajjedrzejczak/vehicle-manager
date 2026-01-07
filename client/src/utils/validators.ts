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
  }else if (!emailRegex.test(data.email)) {
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
  if (!data.registrationNumber?.trim())
    errors.registrationNumber = 'Nr rejestracyjny jest wymagany!';

  const currentYear = new Date().getFullYear();
  const yearNum = Number(data.year);

  if (!data.year || yearNum < 1970 || yearNum > currentYear + 1) {
    errors.year = `Rok musi być między 1970 a ${currentYear + 1}!`;
  }

  const mileageValue = data.mileage.toString().trim();
  const mileageNum = Number(mileageValue);

  if (mileageValue === '' || isNaN(mileageNum)) {
    errors.mileage = 'Przebieg jest wymagany!';
  }

  if (mileageNum < 0) {
    errors.mileage = 'Przebieg nie może być ujemny!';
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

  const mileageStr = data.mileage?.toString().trim();
  const mileageNum = Number(data.mileage);

  if (!mileageStr || mileageStr === '') {
    errors.mileage = 'Wpisz przebieg!';
  } else if (mileageNum < 0) {
    errors.mileage = 'Przebieg nie może być ujemny!';
  } else if (mileageNum < lastCarMileage) {
    errors.mileage = `Przebieg nie może być mniejszy niż ostatni (${lastCarMileage} km)!`;
  }

  if (!data.liters || Number(data.liters) <= 0)
    errors.liters = 'Wpisz ilość paliwa!';
  if (!data.cost || Number(data.cost) <= 0) errors.cost = 'Wpisz koszt!';

  return errors;
};
