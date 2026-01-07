export type StatusType = 'ok' | 'warning' | 'critical' | '';
export type PriorityType = 'high' | 'medium' | 'low';

export interface ServiceEntry {
  status: StatusType;
  nextMileage?: number;
  endDate?: string;
}

export interface CarServices {
  oilChange: ServiceEntry;
  inspection: ServiceEntry;
  insurance: ServiceEntry;
  warranty: ServiceEntry;
}

export interface Fueling {
  id: number | string;
  carId: number | string;
  date: string;
  liters: number;
  mileage: number;
  cost: number;
  createdAt?: string;
}

export interface Car {
  id: number | string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  fuelings?: Fueling[];
  services: CarServices;
}

export type TabId = 'overview' | 'fueling' | 'services';
