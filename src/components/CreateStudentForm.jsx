import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from '../api/axios';

const CreateStudentForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    class: '',
    rollNumber: '',
    parent: '',
  });
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/classes').then(res => setClasses(res.data));
    axios.get('/api/users?role=Parent').then(res => setParents(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await axios.post('/api/students', form);
      setSuccess(true);
      setForm({ name: '', email: '', password: '', class: '', rollNumber: '', parent: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating student');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          Create Student Account
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={form.class}
              onChange={handleChange}
              required
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Roll Number"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent</InputLabel>
            <Select
              name="parent"
              value={form.parent}
              onChange={handleChange}
              required
            >
              {parents.map((parent) => (
                <MenuItem key={parent._id} value={parent._id}>
                  {parent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Student'}
          </Button>

          {success && (
            <Box sx={{ color: 'green', mt: 2, textAlign: 'center', fontWeight: 500 }}>
              ✅ Student created successfully!
            </Box>
          )}
          {error && (
            <Box sx={{ color: 'red', mt: 2, textAlign: 'center', fontWeight: 500 }}>
              ❌ {error}
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CreateStudentForm;
