import { Modal, Box, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExistingTransaction, NewTransaction } from '../types/Transaction';
import TransactionModal from './TransactionModal';
import { useState } from 'react';
import httpService from '../services/HttpService.tsx';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transactionData: ExistingTransaction) => void;
}

const AddTransactionModal = ({
  open,
  onClose,
  onAdd,
}: AddTransactionModalProps) => {
  const [loading, setLoading] = useState(false);
  const handleSave = async (transactionData: NewTransaction) => {
    setLoading(true);
    try {
      const response = await httpService.createTransaction(transactionData);
      onAdd(response);
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Error creating transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <TransactionModal open={open} onClose={onClose} onSave={handleSave} />
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default AddTransactionModal;
