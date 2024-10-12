export interface Transaction {
  _id: string;
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface RecurringBill {
  _id?: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  dueDate: number;
  frequency: string;
  status: string;
}

export interface Pot {
  _id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}
