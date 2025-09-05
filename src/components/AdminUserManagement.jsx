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

export default function AdminUserManagement() {
  const queryClient = useQueryClient();
  const initialForm = { name: '', email: '', password: '', role: 'Teacher' };
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  // Fetch users
  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('/users');
      return res.data;
    },
  });

  // Create user
  const createUser = useMutation({
    mutationFn: async (newUser) => {
      const res = await axios.post('/users', newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setForm(initialForm);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating user');
    },
  });

  // Delete user
  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Create User Section */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Create New User
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser.mutate(form);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={form.role}
                  label="Role"
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ py: 1.2, fontWeight: 600, borderRadius: 2 }}
              >
                Create User
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* User List Section */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          User List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {isLoading && <Typography>Loading users...</Typography>}
        {fetchError && <Alert severity="error">Error loading users</Alert>}

        {data && (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 2 }}
                        onClick={() => deleteUser.mutate(user._id)}
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
