import { Modal, Box, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExistingTransaction, NewTransaction } from '../types/Transaction';
import TransactionModal from './TransactionModal';
import { useState } from 'react';
import httpService from '../services/HttpService.tsx';

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: ExistingTransaction;
  onUpdate: (updatedTransaction: ExistingTransaction) => void;
}

const EditTransactionModal = ({
  open,
  onClose,
  transaction,
  onUpdate,
}: EditTransactionModalProps) => {
  const [loading, setLoading] = useState(false);
  const handleSave = async (updatedTransaction: NewTransaction) => {
    setLoading(true);
    try {
      const response: ExistingTransaction = await httpService.updateTransaction(
        transaction.id,
        updatedTransaction,
      );
      onUpdate(response);
      onClose();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error updating transaction. Please try again.');
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
        <TransactionModal
          open={open}
          onClose={onClose}
          transaction={transaction}
          onSave={handleSave}
        />
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default EditTransactionModal;
