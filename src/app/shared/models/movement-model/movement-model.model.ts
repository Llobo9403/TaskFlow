export interface Movement {
  type: string;
  amount: number;
  date: string;
}

export interface Account {
  username: string;
  balance: number;
  accountNumber: string;
  agency: string;
  activeDebt: number;
  employmentType: string;
}

export interface MovementResponse {
  movements: Movement[];
}

export interface CreditSimulationModel {
  date: string;
  type: string;
  amount: number;
  time: number;
  rate: number;
  parcelValue: number;
}

export type ProjectionType = 'PRICE' | 'SAC';
export interface SimulationCreate {
  projectionType: ProjectionType;
  requestedAmount: number;
  requestedMonths: number;
  averageIncome: number;
  maxAllowedMonths: number;
  maxParcelValue: number;
  maxAllowedAmount: number;
  monthlyRate: number;
  installmentFirst?: number;
  installmentFixed?: number;
  totalPaid: number;
  totalInterest: number;
}

export interface Simulation extends SimulationCreate {
  id: number;
  createdAt: string; // ou Date
  status?: 'PENDING' | 'ACCEPTED' | 'CANCELED';
}
