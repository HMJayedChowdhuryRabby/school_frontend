import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios';
import { Card, CardContent, Typography, Grid, Avatar, Container } from '@mui/material';

export default function TeacherListPage() {
  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['teachers-public'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Our Teachers
      </Typography>
      {isLoading && <Typography>Loading teachers...</Typography>}
      {error && <Typography color="error">Error loading teachers</Typography>}
      <Grid container spacing={4}>
        {teachers?.map(teacher => (
          <Grid item xs={12} sm={6} md={4} key={teacher._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Avatar
                src={teacher.user?.profile?.photoUrl || ''}
                alt={teacher.user?.name}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {teacher.user?.name || '-'}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {teacher.user?.email || '-'}
                </Typography>
                <Typography variant="body2">
                  Subjects: {teacher.subjects?.map(s => s?.name).filter(Boolean).join(', ') || '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
