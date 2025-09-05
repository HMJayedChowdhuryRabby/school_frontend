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

export default function AdminGradeManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ student: '', exam: '', marks: '', remarks: '' });
  const [error, setError] = useState('');

  const { data: grades, isLoading, error: fetchError } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => (await axios.get('/grades')).data,
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => (await axios.get('/students')).data,
  });

  const { data: exams } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => (await axios.get('/exams')).data,
  });

  const createGrade = useMutation({
    mutationFn: async (newGrade) => (await axios.post('/grades', newGrade)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(['grades']);
      setForm({ student: '', exam: '', marks: '', remarks: '' });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error entering grade');
    },
  });

  const deleteGrade = useMutation({
    mutationFn: async (id) => await axios.delete(`/grades/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['grades']),
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Grade Management
      </Typography>

      {/* Enter Grade Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Enter Grade
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Exam</InputLabel>
              <Select
                value={form.exam}
                label="Exam"
                onChange={e => setForm(f => ({ ...f, exam: e.target.value }))}
              >
                {exams?.map(ex => (
                  <MenuItem key={ex._id} value={ex._id}>{ex.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Marks"
              type="number"
              value={form.marks}
              onChange={e => setForm(f => ({ ...f, marks: e.target.value }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => createGrade.mutate(form)}
            >
              Enter
            </Button>
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Grade List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Grade List</Typography>
      {isLoading && <Typography>Loading grades...</Typography>}
      {fetchError && <Typography color="error">Error loading grades</Typography>}
      <Grid container spacing={2}>
        {grades?.map(grade => (
          <Grid item xs={12} md={6} key={grade._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {grade.student?.user?.name || grade.student?.name || '-'}
                </Typography>
                <Typography color="text.secondary">Exam: {grade.exam?.name || '-'}</Typography>
                <Typography color="text.secondary">Marks: {grade.marks}</Typography>
                <Typography color="text.secondary">Remarks: {grade.remarks}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteGrade.mutate(grade._id)}
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
