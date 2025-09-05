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

export default function AdminAttendanceManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ student: '', date: '', status: 'Present', remarks: '' });
  const [error, setError] = useState('');

  const { data: attendance, isLoading, error: fetchError } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const res = await axios.get('/attendance');
      return res.data;
    },
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await axios.get('/students');
      return res.data;
    },
  });

  const createAttendance = useMutation({
    mutationFn: async (newAttendance) => {
      const payload = {
        student: newAttendance.student,
        date: new Date(newAttendance.date).toISOString(),
        status: newAttendance.status,
        remarks: newAttendance.remarks,
      };
      const res = await axios.post('/attendance', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      setForm({ student: '', date: '', status: 'Present', remarks: '' });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error marking attendance');
    },
  });

  const deleteAttendance = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/attendance/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
    },
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Attendance Management
      </Typography>

      {/* Mark Attendance Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Mark Attendance
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Student</InputLabel>
              <Select
                value={form.student}
                label="Student"
                onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
                required
              >
                {students?.map(s => (
                  <MenuItem key={s._id} value={s._id}>{s.user?.name || '-'}</MenuItem>
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
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
              onClick={() => createAttendance.mutate(form)}
            >
              Mark
            </Button>
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Attendance Records */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Attendance Records</Typography>
      {isLoading && <Typography>Loading attendance...</Typography>}
      {fetchError && <Typography color="error">Error loading attendance</Typography>}
      <Grid container spacing={2}>
        {attendance?.map(att => (
          <Grid item xs={12} md={6} key={att._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {att.student?.user?.name || att.student?.name || '-'}
                </Typography>
                <Typography color="text.secondary">{att.date?.slice(0, 10)}</Typography>
                <Typography
                  sx={{
                    display: 'inline-block',
                    mt: 1,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 'bold',
                    background: att.status === 'Present' ? '#4caf50' : att.status === 'Absent' ? '#f44336' : '#ff9800',
                  }}
                >
                  {att.status}
                </Typography>
                {att.remarks && <Typography sx={{ mt: 1 }}>{att.remarks}</Typography>}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteAttendance.mutate(att._id)}
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
