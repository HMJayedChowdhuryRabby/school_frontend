import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function SchoolProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", message: "", image: null });
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
  axios.get("/profiles").then((res) => setProfiles(res.data));
  }, []);

  const handleEdit = (profile) => {
    setEditingId(profile._id);
    setForm({ name: profile.name, role: profile.role, message: profile.message, image: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("message", form.message);
    if (form.image) formData.append("image", form.image);
  await axios.put(`/profiles/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  const res = await axios.get("/profiles");
    setProfiles(res.data);
    setEditingId(null);
    setForm({ name: "", role: "", message: "", image: null });
  };

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("message", form.message);
    if (form.image) formData.append("image", form.image);
  await axios.post(`/profiles`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  const res = await axios.get("/profiles");
    setProfiles(res.data);
    setAddOpen(false);
    setForm({ name: "", role: "", message: "", image: null });
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        School Leadership Profiles
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setAddOpen(true)}>
        Add Leadership Profile
      </Button>
      <Grid container spacing={4}>
        {profiles.map((profile) => (
          <Grid item xs={12} md={4} key={profile._id}>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column", md: "row" } }}>
              <img src={profile.imageUrl.startsWith('/uploads') ? `http://localhost:5000${profile.imageUrl}` : profile.imageUrl} alt={profile.role} style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", marginRight: 24, marginBottom: 12, boxShadow: "0 2px 8px #c5cae9" }} />
              <Box>
                {editingId === profile._id ? (
                  <>
                    <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 1 }} />
                    <TextField label="Role" name="role" value={form.role} onChange={handleChange} fullWidth sx={{ mb: 1 }} />
                    <TextField label="Message" name="message" value={form.message} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 1 }} />
                    <Button variant="contained" component="label" sx={{ mb: 1 }}>
                      {form.image ? `Selected: ${form.image.name}` : "Upload Image"}
                      <input type="file" name="image" hidden accept="image/*" onChange={handleChange} />
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleSave} sx={{ mr: 1 }}>Save</Button>
                    <Button variant="text" color="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">{profile.name}</Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">{profile.role}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{profile.message}</Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => handleEdit(profile)}>Edit</Button>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Leadership Profile</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Role" name="role" value={form.role} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Message" name="message" value={form.message} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            {form.image ? `Selected: ${form.image.name}` : "Upload Image"}
            <input type="file" name="image" hidden accept="image/*" onChange={handleChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} color="primary" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
