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

export default function AdminSubjectManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', teacher: '', classes: [] });
  const [error, setError] = useState('');

  const { data: subjects, isLoading, error: fetchError } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await axios.get('/subjects');
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

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await axios.get('/classes');
      return res.data;
    },
  });

  const createSubject = useMutation({
    mutationFn: async (newSubject) => {
      const res = await axios.post('/subjects', newSubject);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      setForm({ name: '', code: '', teacher: '', classes: [] });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating subject');
    },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
    },
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Subject Management
      </Typography>

      {/* Create Subject Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Subject
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            createSubject.mutate(form);
          }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <TextField
            label="Subject Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Code"
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 150 }}
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
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Classes</InputLabel>
            <Select
              multiple
              value={form.classes}
              onChange={e => setForm(f => ({ ...f, classes: e.target.value }))}
            >
              {classes?.map(c => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="success" sx={{ minWidth: 120 }}>
            Create
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Subject List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Subject List</Typography>
      {isLoading && <Typography>Loading subjects...</Typography>}
      {fetchError && <Typography color="error">Error loading subjects</Typography>}
      <Grid container spacing={3}>
        {subjects?.map(sub => (
          <Grid item xs={12} md={6} key={sub._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{sub.name} ({sub.code})</Typography>
                <Typography color="text.secondary">
                  Teacher: {sub.teacher?.user?.name || '-'}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Classes: {sub.classes?.map(c => c.name).join(', ') || '-'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSubject.mutate(sub._id)}
                  size="small"
                >
                  Delete
                </Button>
                {sub.classes?.length > 0 && <Chip label="Assigned" color="primary" size="small" />}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
