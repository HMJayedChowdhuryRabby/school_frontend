import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FiberNewIcon from '@mui/icons-material/FiberNew';

export default function AdminNoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', pdf: null });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/notices');
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch {
      setNotices([]);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let pdfUrl = '';
      if (form.pdf) {
        const data = new FormData();
        data.append('file', form.pdf);
  const res = await axios.post('/api/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        pdfUrl = res.data.url;
      }
      const token = localStorage.getItem('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      if (editingId) {
        await axios.put(`/api/notices/${editingId}`, { title: form.title, description: form.description, pdfUrl }, config);
      } else {
        await axios.post('/api/notices', { title: form.title, description: form.description, pdfUrl }, config);
      }
      setForm({ title: '', description: '', pdf: null });
      setEditingId(null);
      setModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error('Failed to submit notice:', err);
    }
    setLoading(false);
  };

  const handleEdit = notice => {
    setForm({ title: notice.title, description: notice.description, pdf: null });
    setEditingId(notice._id);
    setModalOpen(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this notice?')) return;
    const token = localStorage.getItem('accessToken');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.delete(`/api/notices/${id}`, config);
    fetchNotices();
  };

  const isNewNotice = date => {
    if (!date) return false;
    const noticeDate = new Date(date);
    const now = new Date();
    const diffDays = (now - noticeDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 4, backgroundColor: '#f5f7fa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Admin Notice Dashboard
      </Typography>

      {/* Add/Edit Form */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {editingId ? 'Edit Notice' : 'Add New Notice'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth variant="outlined" />
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            {form.pdf ? form.pdf.name : 'Upload PDF'}
            <input type="file" name="pdf" accept="application/pdf" hidden onChange={handleChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, py: 1.5 }}>
            {editingId ? 'Update Notice' : 'Add Notice'}
          </Button>
        </Box>
      </Card>

      {/* Notices List */}
      <Grid container spacing={3}>
        {notices.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No notices available.</Typography>
          </Grid>
        ) : (
          notices.map(notice => (
            <Grid item xs={12} md={6} key={notice._id}>
              <Card
                sx={{
                  position: 'relative',
                  '&:hover': { boxShadow: 6 },
                  transition: '0.3s',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 180,
                }}
              >
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  {notice.pdfUrl && <Chip icon={<PictureAsPdfIcon />} label="PDF" color="info" size="small" />}
                  {isNewNotice(notice.date) && <Chip icon={<FiberNewIcon />} label="New" color="success" size="small" />}
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{notice.title}</Typography>
                  {notice.date && <Typography variant="body2" color="text.secondary">{new Date(notice.date).toLocaleDateString()}</Typography>}
                  {notice.description && (
                    <Typography sx={{ mt: 1 }}>
                      {notice.description.split('\n').map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    {notice.pdfUrl && (
                      <Button variant="outlined" size="small" href={`http://localhost:5000${notice.pdfUrl}`} target="_blank">
                        View PDF
                      </Button>
                    )}
                  </Box>
                  <Box>
                    <IconButton color="primary" onClick={() => handleEdit(notice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(notice._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Edit Notice Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Notice</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth />
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              {form.pdf ? form.pdf.name : 'Upload PDF'}
              <input type="file" name="pdf" accept="application/pdf" hidden onChange={handleChange} />
            </Button>
            {editingId && notices.find(n => n._id === editingId)?.pdfUrl && (
              <Button variant="outlined" color="primary" href={`http://localhost:5000${notices.find(n => n._id === editingId).pdfUrl}`} target="_blank">
                View Current PDF
              </Button>
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Update Notice
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
