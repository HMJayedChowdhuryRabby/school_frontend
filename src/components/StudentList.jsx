import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent
} from '@mui/material';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/students').then(res => setStudents(res.data));
    axios.get('/api/classes').then(res => setClasses(res.data));
  }, []);

  const filtered = students.filter(s => {
    const classMatch = selectedClass ? (s.class && s.class._id === selectedClass) : true;
    const searchMatch = search ? (s.user.name.toLowerCase().includes(search.toLowerCase())) : true;
    return classMatch && searchMatch;
  });

  return (
    <Box sx={{ maxWidth: 1100, margin: '0 auto', p: 4 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 4, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', p: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="white">
            Student List
          </Typography>
        </Box>
        <CardContent>
          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={e => setSelectedClass(e.target.value)}
              >
                <MenuItem value=''>All Classes</MenuItem>
                {classes.map(cls => (
                  <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Search by Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 250 }}
            />
          </Box>

          {/* Student Table */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Roll No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Parent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map(s => (
                    <TableRow
                      key={s._id}
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': { backgroundColor: '#f9f9f9', transform: 'scale(1.01)' }
                      }}
                    >
                      <TableCell>{s.user?.name}</TableCell>
                      <TableCell>{s.class?.name}</TableCell>
                      <TableCell>{s.rollNumber}</TableCell>
                      <TableCell>{s.parent?.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#888' }}>
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
