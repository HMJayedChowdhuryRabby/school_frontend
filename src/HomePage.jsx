import React from 'react';
import axios from './api/axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Paper, Button, Link, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CollectionsIcon from '@mui/icons-material/Collections';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GallerySection from './components/GallerySection';
import AdministrationSection from './components/AdministrationSection';


export default function HomePage() {
  const navigate = useNavigate();
  const [notices, setNotices] = React.useState([]);
  const [selectedNotice, setSelectedNotice] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const aboutRef = React.useRef(null);
  const noticesRef = React.useRef(null);
  const academicsRef = React.useRef(null);
  const resourcesRef = React.useRef(null);
  const galleryRef = React.useRef(null);
  // Marquee logic
  const marqueeRef = React.useRef(null);
  const [marqueePaused, setMarqueePaused] = React.useState(false);
  const [marqueeWidth, setMarqueeWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [marqueeX, setMarqueeX] = React.useState(0);

  // Banner carousel logic
  const [bannerImages, setBannerImages] = React.useState([]);
  const [currentBanner, setCurrentBanner] = React.useState(0);
  React.useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
    axios.get('/api/banner-images').then(res => {
      setBannerImages(res.data.map(img => backendUrl + img.url));
    });
  }, []);
  React.useEffect(() => {
    if (bannerImages.length === 0) return;
    const timer = setInterval(() => setCurrentBanner(c => (c + 1) % bannerImages.length), 3500);
    return () => clearInterval(timer);
  }, [bannerImages]);

  React.useEffect(() => {
    document.body.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflowX = 'hidden';
    axios.get('/api/notices')
      .then(res => Array.isArray(res.data) ? setNotices(res.data) : setNotices([]))
      .catch(() => setNotices([]));
    return () => {
      document.body.style.background = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
      document.documentElement.style.background = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  const scrollToSection = ref => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNotice(null);
  };

  // Marquee animation effect
  React.useEffect(() => {
    let frame;
    const step = () => {
      if (!marqueePaused && marqueeWidth > containerWidth) {
        setMarqueeX(prev => {
          let next = prev - 2.2; // speed (increased)
          if (Math.abs(next) > marqueeWidth) {
            return containerWidth;
          }
          return next;
        });
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [marqueePaused, marqueeWidth, containerWidth]);

  // Update widths on mount and when notices change
  React.useEffect(() => {
    const updateWidths = () => {
      if (marqueeRef.current && marqueeRef.current.parentElement) {
        setMarqueeWidth(marqueeRef.current.scrollWidth);
        setContainerWidth(marqueeRef.current.parentElement.offsetWidth);
      }
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [notices]);

  // Reset position when notices change
  React.useEffect(() => {
    setMarqueeX(containerWidth);
  }, [notices, containerWidth]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'transparent', m: 0, p: 0, position: 'relative' }}>
      {/* Header Section */}
      <AppBar position="static" color="primary" sx={{ mb: 0 }}>
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1, sm: 0 }, position: 'relative' }}>
          <Box sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, width: { xs: '100%', sm: 'auto' }, cursor: 'pointer' }}
            onClick={() => navigate('/')}
            title="Go to Home"
          >
            <img src="/logo.jpg" alt="School Logo" style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 8 }} onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            <SchoolIcon sx={{ fontSize: 32, ml: 1, display: 'none' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: 18, sm: 24 } }}>
            Malumghat Ideal School
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}>
            <Button color="inherit" startIcon={<NotificationsActiveIcon />} sx={{ fontSize: { xs: 12, sm: 16 }, minWidth: { xs: 80, sm: 120 } }} onClick={() => scrollToSection(noticesRef)}>Notices</Button>
            <Button color="inherit" startIcon={<MenuBookIcon />} sx={{ fontSize: { xs: 12, sm: 16 }, minWidth: { xs: 80, sm: 120 } }} onClick={() => scrollToSection(academicsRef)}>Academics</Button>
            <Button color="inherit" startIcon={<CollectionsIcon />} sx={{ fontSize: { xs: 12, sm: 16 }, minWidth: { xs: 80, sm: 120 } }} onClick={() => scrollToSection(galleryRef)}>Gallery</Button>
            <Button color="inherit" startIcon={<SchoolIcon />} sx={{ fontSize: { xs: 12, sm: 16 }, minWidth: { xs: 80, sm: 120 } }} href="/students">
              Student List
            </Button>
            <Button
              color="inherit"
              startIcon={<AssignmentIndIcon />}
              sx={{ fontSize: { xs: 12, sm: 16 }, minWidth: { xs: 80, sm: 120 } }}
              component="a"
              href="/teachers"
            >
              Teacher List
            </Button>
            <Button href="/login" variant="contained" color="secondary" sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 16 }, minWidth: { xs: 80, sm: 120 } }}>
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Gap between navbar and notice bar */}
      <Box sx={{ height: { xs: 10, sm: 18 } }} />

      {/* Scrolling Notice Bar (Dynamic & Clickable) */}
      <Paper elevation={2} sx={{ width: '100%', background: '#fffde7', py: 1.5, mb: 2, borderRadius: 0, borderBottom: '1px solid #ffe082', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden', position: 'relative', minHeight: { xs: 44, sm: 52 } }}>
          <Typography variant="subtitle1" color="warning.main" sx={{ fontWeight: 'bold', px: 2, whiteSpace: 'nowrap', fontSize: { xs: 16, sm: 18 }, display: 'flex', alignItems: 'center', height: '100%', minWidth: 140 }}>
            Latest Notices:
          </Typography>
          <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Box
              ref={marqueeRef}
              onMouseEnter={() => setMarqueePaused(true)}
              onMouseLeave={() => setMarqueePaused(false)}
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                fontSize: { xs: 11, sm: 14 },
                color: '#333',
                fontWeight: 550,
                px: 1,
                cursor: 'pointer',
                position: 'relative',
                left: marqueeX,
                transition: marqueePaused ? 'none' : 'left 0s',
                willChange: 'left',
                lineHeight: 1.6,
                minHeight: { xs: 28, sm: 32 },
                alignItems: 'center',
                height: '100%',
              }}
            >
              {notices.length === 0 ? (
                'No notices available.'
              ) : (
                notices.slice(0, 5).map((notice, idx, arr) => (
                  <span key={notice._id || idx} style={{ marginRight: 32, verticalAlign: 'middle', display: 'inline-block' }} onClick={() => handleNoticeClick(notice)}>
                    {notice.title}
                    {idx < arr.length - 1 && <span style={{ color: '#aaa' }}>&nbsp;|&nbsp;</span>}
                  </span>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        {/* Main Banner */}
        <Paper elevation={3} sx={{ p: 0, mb: 6, background: '#fafafa', position: 'relative', overflow: 'hidden', borderRadius: 3 }}>
          {/* Banner Carousel */}
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 260, sm: 360, md: 440 }, minHeight: 260 }}>
            {bannerImages.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`Banner ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 12,
                  display: idx === currentBanner ? 'block' : 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'opacity 0.7s',
                  opacity: idx === currentBanner ? 1 : 0,
                }}
              />
            ))}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2, background: 'rgba(0,0,0,0.35)' }}>
              <Typography variant="h4" fontWeight="bold" color="#fff" gutterBottom sx={{ fontSize: { xs: 28, sm: 40 }, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                Welcome to Malumghat ideal School
              </Typography>
              <Typography variant="h6" color="#fff" gutterBottom sx={{ fontSize: { xs: 18, sm: 28 }, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                Excellence in Education, Leadership, and Community
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* About Us */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }} ref={aboutRef}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Founded in 1990, CKB School & College has a proud tradition of academic excellence and holistic development. Our mission is to nurture young minds, foster creativity, and build future leaders. We believe in a student-centered approach and a commitment to lifelong learning.
          </Typography>
        </Paper>


        {/* Latest Notices (Dynamic List) */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }} ref={noticesRef}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Latest Notices
          </Typography>
          <List>
            {notices.length === 0 ? (
              <ListItem><ListItemText primary="No notices available." /></ListItem>
            ) : (
              // Sort notices by date descending (most recent first)
              notices
                .slice()
                .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
                .slice((page - 1) * 4, page * 4)
                .map((notice, idx) => (
                  <React.Fragment key={notice._id || idx}>
                    <ListItem button onClick={() => handleNoticeClick(notice)}>
                      <ListItemText
                        primary={notice.title}
                        secondary={
                          <>
                            {notice.date ? new Date(notice.date).toLocaleDateString() : ''}
                            {notice.description && (
                              <>
                                <br />
                                <span style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'pre-line',
                                }}>
                                  {notice.description}
                                </span>
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
            )}
          </List>
          {/* Pagination Controls */}
          {notices.length > 4 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ mr: 2 }}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ mx: 2 }}>
                Page {page} of {Math.ceil(notices.length / 4)}
              </Typography>
              <Button
                variant="outlined"
                disabled={page === Math.ceil(notices.length / 4)}
                onClick={() => setPage(page + 1)}
                sx={{ ml: 2 }}
              >
                Next
              </Button>
            </Box>
          )}
        </Paper>

        {/* Administration Section */}
        <AdministrationSection />

        {/* Academic Information */}
<Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }} ref={academicsRef}>
  <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
    Academic Information
  </Typography>
  <Grid container spacing={2} justifyContent="center">
    <Grid item xs={12} sm={4}>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Syllabus</Button>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Exam Results</Button>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Merit Lists</Button>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Academic Calendar</Button>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Resources</Button>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Library</Button>
    </Grid>
  </Grid>
</Paper>


       {/* Student Resources */}
<Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }} ref={resourcesRef}>
  <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
    Student Resources
  </Typography>
  <Grid container spacing={2} justifyContent="center">
    <Grid item xs={12} sm={5}>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Handbook</Button>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Assignments</Button>
    </Grid>
    <Grid item xs={12} sm={5}>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Clubs & Activities</Button>
      <Button variant="outlined" fullWidth sx={{ mb: 2, fontSize: { xs: 12, sm: 16 } }}>Support Services</Button>
    </Grid>
  </Grid>
</Paper>


        {/* Media Gallery */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }} ref={galleryRef}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Media Gallery
          </Typography>
          <GallerySection />
        </Paper>

        {/* Footer Section */}
        <Box sx={{
          mt: 8,
          py: { xs: 3, sm: 5 },
          px: { xs: 2, sm: 6 },
          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
          color: '#fff',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1, color: '#fff' }}>
                  Contact Information
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18, color: 'rgba(255,255,255,0.92)', mb: 2 }}>
                  Address: <span style={{ fontWeight: 500 }}>Malumghat Ideal School</span>, Malumghat, Chakaria, Cox's Bazar.<br />
                  Phone: <span style={{ fontWeight: 500 }}>+880-1817-020542</span><br />
                  Email: <span style={{ fontWeight: 500 }}>mis106200@gmail.com</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1, color: '#fff', textAlign: 'center', width: '100%' }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, width: '100%' }}>
                  <IconButton color="primary" sx={{ background: '#fff', color: '#1976d2', boxShadow: '0 2px 8px rgba(25,118,210,0.12)', mx: 0.5 }} href="https://facebook.com" target="_blank">
                    <FacebookIcon fontSize="large" />
                  </IconButton>
                  <IconButton color="primary" sx={{ background: '#fff', color: '#1976d2', boxShadow: '0 2px 8px rgba(25,118,210,0.12)', mx: 0.5 }} href="https://twitter.com" target="_blank">
                    <TwitterIcon fontSize="large" />
                  </IconButton>
                  <IconButton color="primary" sx={{ background: '#fff', color: '#1976d2', boxShadow: '0 2px 8px rgba(25,118,210,0.12)', mx: 0.5 }} href="https://instagram.com" target="_blank">
                    <InstagramIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3, background: 'rgba(255,255,255,0.3)' }} />
            <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, letterSpacing: 1 }}>
              &copy; {new Date().getFullYear()} <span style={{ fontWeight: 600 }}>Malumghat Ideal School</span>. All rights reserved.
            </Typography>
          </Container>
        </Box>
      {/* Notice Details Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedNotice?.title}
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedNotice?.description
              ? selectedNotice.description.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))
              : 'No details available.'}
          </Typography>
          {selectedNotice?.pdfUrl && (
            <Button
              variant="outlined"
              color="primary"
              href={selectedNotice.pdfUrl.startsWith('http') ? selectedNotice.pdfUrl : `${axios.defaults.baseURL}${selectedNotice.pdfUrl}`}
              target="_blank"
              sx={{ mt: 1 }}
            >
              View/Download PDF
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
}
