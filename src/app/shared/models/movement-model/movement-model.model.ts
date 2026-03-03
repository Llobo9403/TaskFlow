export interface Movement {
  type: string;
  amount: number;
  date: string;
  description: string;
}

export interface Account {
  username: string;
  balance: number;
  accountNumber: number;
  agency: number;
  activeDebt: number;
  employmentType: string;
  hasDelinquency: boolean;
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
  createdAt: string;
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
  status?: 'PENDING' | 'ACCEPTED' | 'CANCELED';
}

export interface TransferDialogResult {
  amount: number;
  agency: string;
  account: string;
}