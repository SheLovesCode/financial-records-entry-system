import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExistingTransaction } from '../types/Transaction.ts';
import React, { useState } from 'react';
import EditTransactionModal from './EditTransactionModal.tsx';
import { useNavigate } from 'react-router-dom';
import httpService from '../services/HttpService.tsx';
import { toast, ToastContainer } from 'react-toastify';

interface TransactionTableProps {
  transactions: ExistingTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<ExistingTransaction[]>>;
}

export default function TransactionTable({
  transactions,
  setTransactions,
}: TransactionTableProps) {
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 5 };
  const [loading, setLoading] = useState(false);
  const [openEditTransaction, setOpenEditTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExistingTransaction | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<ExistingTransaction | null>(null);

  const handleView = (transaction: ExistingTransaction) => {
    navigate(`/transactions/${transaction.id}`);
  };

  const handleEdit = (transaction: ExistingTransaction) => {
    if (transaction.amount < 0) {
      transaction.amount = transaction.amount * -1;
    }
    setSelectedTransaction(transaction);
    setOpenEditTransaction(true);
  };

  const handleDelete = async (transaction: ExistingTransaction) => {
    setTransactionToDelete(transaction);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        setLoading(true);
        await httpService.deleteTransaction(transactionToDelete.id);
        const updatedTransactions: ExistingTransaction[] =
          await httpService.getTransactions();
        setTransactions(updatedTransactions);
        toast.success('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Error deleting transaction. Please try again.');
      } finally {
        setLoading(false);
        setOpenDeleteModal(false);
        setTransactionToDelete(null);
      }
    }
  };

  const handleCloseEditTransaction = () => {
    setOpenEditTransaction(false);
    setSelectedTransaction(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setTransactionToDelete(null);
  };

  const handleUpdateTransaction = (updatedTransaction: ExistingTransaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction,
      ),
    );
    handleCloseEditTransaction();
  };

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      type: 'string',
      flex: 2,
      headerAlign: 'center',
      renderCell: (params) => {
        const formattedDate = new Date(params.value).toLocaleString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return (
          <Typography sx={{ display: 'contents', alignItems: 'center' }}>
            {formattedDate}
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      headerAlign: 'center',
    },
    { field: 'type', headerName: 'Type', flex: 1, headerAlign: 'center' },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '12px' }}>
          <Typography sx={{ marginRight: '4px' }}>R</Typography>
          <Typography sx={{ textAlign: 'right', width: '100%' }}>
            {Math.abs(params.value).toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          padding: '24px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'white',
        }}
      >
        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={transactions}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{
              border: 0,
              backgroundColor: '#fff',
              marginTop: '16px',
              width: '100%',
            }}
          />
        )}
      </Paper>
      <ToastContainer />

      {selectedTransaction && (
        <EditTransactionModal
          open={openEditTransaction}
          onClose={handleCloseEditTransaction}
          transaction={selectedTransaction}
          onUpdate={handleUpdateTransaction}
        />
      )}

      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this transaction? Deleting this
            transaction will affect your balance.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, padding: 2 }}>
          <Button
            variant="outlined"
            className="secondary-button"
            onClick={handleCloseDeleteModal}
            sx={{ width: '150px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="primary-button"
            onClick={handleConfirmDelete}
            autoFocus
            sx={{ width: '150px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
