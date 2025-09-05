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
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';

export default function AdminClassManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', teacher: '' });
  const [error, setError] = useState('');

  const { data: classes, isLoading, error: fetchError } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await axios.get('/classes');
      return res.data;
    },
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
  });

  const createClass = useMutation({
    mutationFn: async (newClass) => {
      const res = await axios.post('/classes', newClass);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
      setForm({ name: '', teacher: '' });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating class');
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
    },
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Class Management
      </Typography>

      {/* Create Class Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Class
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            createClass.mutate(form);
          }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <TextField
            label="Class Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl sx={{ flex: 1, minWidth: 200 }} required>
            <InputLabel>Teacher</InputLabel>
            <Select
              value={form.teacher}
              onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}
            >
              <MenuItem value="">
                <em>Select Teacher</em>
              </MenuItem>
              {teachers?.map(t => (
                <MenuItem key={t._id} value={t._id}>{t.user?.name || t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="success" sx={{ minWidth: 120 }}>
            Create
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Class List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Class List</Typography>
      {isLoading && <Typography>Loading classes...</Typography>}
      {fetchError && <Typography color="error">Error loading classes</Typography>}
      <Grid container spacing={3}>
        {classes?.map(cls => (
          <Grid item xs={12} md={6} key={cls._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{cls.name}</Typography>
                <Typography color="text.secondary">
                  Teacher: {cls.teacher?.user?.name || '-'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteClass.mutate(cls._id)}
                  size="small"
                >
                  Delete
                </Button>
                {cls.teacher && <Chip label="Assigned" color="primary" size="small" />}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
