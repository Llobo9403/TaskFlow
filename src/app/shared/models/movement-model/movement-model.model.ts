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
