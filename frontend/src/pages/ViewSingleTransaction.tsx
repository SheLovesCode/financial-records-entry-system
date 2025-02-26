import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Paper,
  Button,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CardContent,
  Card,
} from '@mui/material';
import { ExistingTransaction } from '../types/Transaction.ts';
import EditTransactionModal from '../components/EditTransactionModal.tsx';
import httpService from '../services/HttpService.tsx';

function ViewSingleTransaction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<ExistingTransaction | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchTransaction = async () => {
    setLoading(true);
    setError(null);
    try {
      const transactionID: number = Number(id);
      const transaction: ExistingTransaction =
        await httpService.getTransaction(transactionID);
      if (transaction.amount < 0) {
        transaction.amount = transaction.amount * -1;
      }
      setTransaction(transaction);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('Transaction not found.');
      } else {
        setError('Error fetching transaction.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleUpdateTransaction = () => {
    fetchTransaction();
    setEditModalOpen(false);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <Typography color="error">{error}</Typography>
        <Button
          sx={{ width: '40%', marginTop: '20px' }}
          variant="outlined"
          className="secondary-button"
          onClick={handleGoHome}
        >
          Go Back to Home Page
        </Button>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <Typography>Transaction not found</Typography>
        <Button
          sx={{ width: '40%', marginTop: '20px' }}
          variant="outlined"
          className="secondary-button"
          onClick={handleGoHome}
        >
          Go Back to Home Page
        </Button>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            margin: 'auto',
          }}
        >
          Transaction Details
        </Typography>
      </Box>
      <Card
        style={{ width: '50%', margin: '0 auto' }}
        sx={{ borderTop: '1px solid #ccc' }}
      >
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>R {transaction.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            className="primary-button"
            onClick={handleEdit}
            sx={{ width: '90%', marginTop: '20px' }}
          >
            Edit Transaction
          </Button>
          <Button
            sx={{ width: '90%', marginTop: '20px' }}
            variant="outlined"
            className="secondary-button"
            onClick={handleGoHome}
          >
            Go Back to Home Page
          </Button>
        </CardContent>
      </Card>
      <EditTransactionModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        transaction={transaction}
        onUpdate={handleUpdateTransaction}
      />
    </div>
  );
}

export default ViewSingleTransaction;
