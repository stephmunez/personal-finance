export interface Transaction {
  _id?: string;
  name: string;
  category: string;
  date: string;
  amount: number;
}

export interface RecurringBill {
  _id?: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  status: string;
  dueDate: string;
}

export interface Pot {
  _id?: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

export interface Budget {
  _id?: string;
  category: string;
  maximum: number;
  theme: string;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  token?: string;
}
