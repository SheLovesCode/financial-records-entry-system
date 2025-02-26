import { Container, Typography, Box, Button, Alert } from '@mui/material';
import AddTransactionModal from '../components/AddTransactionModal.tsx';
import TransactionTable from '../components/TransactionTable.tsx';
import { useState, useEffect } from 'react';
import { ExistingTransaction } from '../types/Transaction.ts';
import Paper from '@mui/material/Paper';
import { AddCircleOutline } from '@mui/icons-material';
import '../App.css';
import httpService from '../services/HttpService.tsx';

function HomePage() {
  const [open, setOpenAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState<ExistingTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ExistingTransaction[] =
          await httpService.getTransactions();
        setTransactions(response);
      } catch (error) {
        setError('Failed to fetch transactions. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleOpenAddTransaction = () => setOpenAddTransaction(true);
  const handleCloseAddTransaction = () => setOpenAddTransaction(false);

  const handleAddTransaction = (newTransaction: ExistingTransaction) => {
    setTransactions([...transactions, newTransaction]);
    handleCloseAddTransaction();
  };

  function calculateBalance(transactions: ExistingTransaction[]): number {
    return transactions.reduce((balance, transaction) => {
      return balance + transaction.amount;
    }, 0);
  }

  useEffect(() => {
    setBalance(calculateBalance(transactions));
  }, [transactions]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom justifySelf={'center'}>
        Banking Transaction Manager
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper
        elevation={3}
        sx={{
          padding: '24px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'beige',
          marginBottom: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Balance: R{balance.toFixed(2)}</Typography>
          <Button
            variant="contained"
            className="primary-button"
            onClick={handleOpenAddTransaction}
          >
            <AddCircleOutline />
            Add Transaction
          </Button>
        </Box>
      </Paper>
      <AddTransactionModal
        open={open}
        onClose={handleCloseAddTransaction}
        onAdd={handleAddTransaction}
      />
      {transactions.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No transactions available.
        </Typography>
      ) : (
        <>
          <AddTransactionModal
            open={open}
            onClose={handleCloseAddTransaction}
            onAdd={handleAddTransaction}
          />
          <TransactionTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </>
      )}
    </Container>
  );
}

export default HomePage;
