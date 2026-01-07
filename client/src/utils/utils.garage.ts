export type StatusType = 'success' | 'warning' | 'danger' | 'neutral';

interface DateStatusResult {
  label: string;
  status: StatusType;
  isExpired: boolean;
}

interface OilStatusResult {
  kmToNext: number;
  status: StatusType;
  statusLabel: string;
  isWarning: boolean;
}

//  Oblicza status na podstawie daty
//  Zwraca status 'danger' dla daty przeszłej i 'warning' dla < 30 dni.
export const calculateDateStatus = (dateString?: string): DateStatusResult => {
  if (!dateString) {
    return { label: 'Brak', status: 'neutral', isExpired: false };
  }

  const today = new Date();

  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Wygasło', status: 'danger', isExpired: true };
  }
  if (diffDays <= 30) {
    return { label: 'Wkrótce', status: 'warning', isExpired: false };
  }

  return { label: 'W porządku', status: 'success', isExpired: false };
};


export const calculateOilStatus = (
  currentMileage: number,
  interval = 15000
): OilStatusResult => {
  const kmToNext = interval - (currentMileage % interval);
  const isWarning = kmToNext < 1000; // Ostrzegaj poniżej 1000 km

  return {
    kmToNext,
    status: isWarning ? 'warning' : 'success',
    statusLabel: isWarning ? 'Wymiana wkrótce' : 'W porządku',
    isWarning,
  };
};
