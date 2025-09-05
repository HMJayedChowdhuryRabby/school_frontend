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

export default function AdminExamManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', subject: '', class: '', date: '' });
  const [error, setError] = useState('');

  const { data: exams, isLoading, error: fetchError } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const res = await axios.get('/exams');
      return res.data;
    },
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await axios.get('/subjects');
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

  const createExam = useMutation({
    mutationFn: async (newExam) => {
      const res = await axios.post('/exams', newExam);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['exams']);
      setForm({ name: '', subject: '', class: '', date: '' });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating exam');
    },
  });

  const deleteExam = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/exams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['exams']);
    },
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Exam Management
      </Typography>

      {/* Create Exam Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Exam
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Exam Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select
                value={form.subject}
                label="Subject"
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              >
                {subjects?.map(sub => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Class</InputLabel>
              <Select
                value={form.class}
                label="Class"
                onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
              >
                {classes?.map(cls => (
                  <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => createExam.mutate(form)}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Exam List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Exam List</Typography>
      {isLoading && <Typography>Loading exams...</Typography>}
      {fetchError && <Typography color="error">Error loading exams</Typography>}
      <Grid container spacing={2}>
        {exams?.map(exam => (
          <Grid item xs={12} md={6} key={exam._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">{exam.name}</Typography>
                <Typography color="text.secondary">
                  Subject: {exam.subject?.name || '-'}
                </Typography>
                <Typography color="text.secondary">
                  Class: {exam.class?.name || '-'}
                </Typography>
                <Typography color="text.secondary">
                  Date: {exam.date?.slice(0, 10)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteExam.mutate(exam._id)}
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
