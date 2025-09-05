import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Typography,
  Grid,
  Divider,
  Box,
} from '@mui/material';

export default function AdminStudentManagement() {
  const queryClient = useQueryClient();
  const initialFormState = { name: '', email: '', password: '', class: '', rollNumber: '', parentName: '' };
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');

  // Fetch students
  const { data: students, isLoading, error: fetchError } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await axios.get('/students');
      return res.data;
    },
  });

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await axios.get('/classes');
      return res.data;
    },
  });

  // Create student
  const createStudent = useMutation({
    mutationFn: async (newStudent) => {
      const res = await axios.post('/students', newStudent);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      setForm(initialFormState);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating student');
    },
  });

  // Delete student
  const deleteStudent = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Create Student Section */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Create New Student
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createStudent.mutate(form);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Student Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  value={form.class}
                  label="Class"
                  onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                >
                  <MenuItem value="">
                    <em>Select Class</em>
                  </MenuItem>
                  {classes &&
                    classes.map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Roll Number"
                value={form.rollNumber}
                onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Parent Name"
                value={form.parentName}
                onChange={(e) => setForm((f) => ({ ...f, parentName: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: 600, borderRadius: 2 }}
          >
            Create Student
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Student List Section */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Student List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {isLoading && <Typography>Loading students...</Typography>}
        {fetchError && <Alert severity="error">Error loading students</Alert>}

        {students && (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roll Number</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Parent</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((stu, index) => (
                  <TableRow
                    key={stu._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                    }}
                  >
                    <TableCell>
                      {stu.user?.name ||
                        stu.name ||
                        (typeof stu.user === 'string' ? stu.user : '-')}
                    </TableCell>
                    <TableCell>{stu.class?.name || '-'}</TableCell>
                    <TableCell>{stu.rollNumber}</TableCell>
                    <TableCell>{stu.parent?.name || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 2 }}
                        onClick={() => deleteStudent.mutate(stu._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
