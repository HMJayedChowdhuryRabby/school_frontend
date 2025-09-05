import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/gallery');
      setImages(res.data);
    } catch {
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      await axios.post('/api/gallery/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      fetchImages();
    } catch {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/gallery/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchImages();
    } catch {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Manage Gallery
      </Typography>

      {/* Upload Form */}
      <Box component="form" onSubmit={handleUpload} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          {file ? file.name : 'Select Image'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !file}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {/* Gallery */}
      <Grid container spacing={2}>
        {images.map(img => (
          <Grid item xs={12} sm={6} md={4} key={img._id}>
            <Card sx={{ position: 'relative', borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={img.url}
                alt={img.filename}
                sx={{ objectFit: 'cover' }}
              />
              <CardActions sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(img._id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
