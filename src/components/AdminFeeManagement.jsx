import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

export default function AdminFeeManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ student: '', amount: '', dueDate: '', status: 'Unpaid', remarks: '' });
  const [error, setError] = useState('');

  const { data: fees, isLoading, error: fetchError } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => (await axios.get('/fees')).data,
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => (await axios.get('/students')).data,
  });

  const createFee = useMutation({
    mutationFn: async (newFee) => (await axios.post('/fees', newFee)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(['fees']);
      setForm({ student: '', amount: '', dueDate: '', status: 'Unpaid', remarks: '' });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating fee');
    },
  });

  const deleteFee = useMutation({
    mutationFn: async (id) => await axios.delete(`/fees/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['fees']),
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Fee Management
      </Typography>

      {/* Create Fee Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create Fee
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Student</InputLabel>
              <Select
                value={form.student}
                label="Student"
                onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
              >
                {students?.map(s => (
                  <MenuItem key={s._id} value={s._id}>{s.user?.name || '-'}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Amount"
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => createFee.mutate(form)}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Fee List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Fee List</Typography>
      {isLoading && <Typography>Loading fees...</Typography>}
      {fetchError && <Typography color="error">Error loading fees</Typography>}

      <Grid container spacing={2}>
        {fees?.map(fee => (
          <Grid item xs={12} md={6} key={fee._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {fee.student?.user?.name || fee.student?.name || '-'}
                </Typography>
                <Typography color="text.secondary">Amount: {fee.amount}</Typography>
                <Typography color="text.secondary">Due Date: {fee.dueDate?.slice(0, 10)}</Typography>
                <Typography color="text.secondary">Status: {fee.status}</Typography>
                <Typography color="text.secondary">Remarks: {fee.remarks}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteFee.mutate(fee._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
