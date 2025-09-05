import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Box, Typography, Button, IconButton, Paper, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminBannerManager() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/banner-images');
      setImages(res.data);
    } catch {
      setImages([]);
    }
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault && e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await axios.post('/api/banner-images', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      fetchImages();
    } catch {
      // Optionally set error state
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/banner-images/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchImages();
    } catch {
      // Optionally set error state
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Manage Banner Images
      </Typography>
      <Box component="form" onSubmit={handleUpload} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          component="label"
        >
          {file ? file.name : 'Select Image'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        <Button type="submit" variant="contained" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>
      <Grid container spacing={2}>
        {images.map(img => (
          <Grid item xs={12} sm={6} md={4} key={img._id}>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
              <img src={img.url} alt="Banner" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <IconButton onClick={() => handleDelete(img._id)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.7)' }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
