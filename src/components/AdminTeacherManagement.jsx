import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

export default function AdminTeacherManagement() {
  const queryClient = useQueryClient();
  const initialFormState = { name: '', email: '', password: '', photo: null, subjects: [] };
  const [form, setForm] = useState(initialFormState);
  // Fetch subjects for selection
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await axios.get('/subjects');
      return res.data;
    },
  });
  const [error, setError] = useState('');

  const { data: teachers, isLoading, error: fetchError } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
  });

  const createTeacher = useMutation({
    mutationFn: async (newTeacher) => {
      const formData = new FormData();
      formData.append('name', newTeacher.name);
      formData.append('email', newTeacher.email);
      formData.append('password', newTeacher.password);
      if (newTeacher.photo) formData.append('photo', newTeacher.photo);
      formData.append('subjects', JSON.stringify(newTeacher.subjects));
      const res = await axios.post('/teachers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      setForm(initialFormState);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating teacher');
    },
  });

  const deleteTeacher = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
    },
  });

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Teacher Management
      </Typography>

      {/* Create Teacher Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Teacher
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            createTeacher.mutate(form);
          }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          encType="multipart/form-data"
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ minWidth: 120 }}
          >
            {form.photo ? form.photo.name : 'Select Photo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={e => setForm(f => ({ ...f, photo: e.target.files[0] }))}
            />
          </Button>
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Subjects</InputLabel>
            <Select
              multiple
              value={form.subjects}
              onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const subj = subjects?.find(s => s._id === id);
                    return <Chip key={id} label={subj?.name || id} />;
                  })}
                </Box>
              )}
            >
              {subjects?.map(s => (
                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="success" sx={{ minWidth: 120 }}>
            Create
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Card>

      {/* Teacher List */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Teacher List</Typography>
      {isLoading && <Typography>Loading teachers...</Typography>}
      {fetchError && <Typography color="error">Error loading teachers</Typography>}
      <Grid container spacing={3}>
        {teachers?.map(teacher => (
          <Grid item xs={12} md={6} key={teacher._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {teacher.user?.profile?.photoUrl && (
                <img
                  src={teacher.user.profile.photoUrl}
                  alt={teacher.user?.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', marginRight: 16 }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {teacher.user?.name || '-'}
                </Typography>
                <Typography color="text.secondary">{teacher.user?.email || '-'}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Subjects: {teacher.subjects?.map(s => s?.name).filter(Boolean).join(', ') || '-'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteTeacher.mutate(teacher._id)}
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
