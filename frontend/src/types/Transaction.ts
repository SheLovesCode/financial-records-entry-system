export interface NewTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export interface ExistingTransaction extends NewTransaction {
  id: number;
  date: string;
}
