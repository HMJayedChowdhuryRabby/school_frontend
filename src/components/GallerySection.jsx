import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // Start with 2 rows
  const imagesPerRow = 4;
  const rowDelay = 3000; // 3 seconds
  useEffect(() => {
    axios.get('/api/gallery')
      .then(res => setImages(res.data))
      .catch(() => setImages([]));
  }, []);

  useEffect(() => {
    if (images.length > visibleRows * imagesPerRow) {
      const timer = setTimeout(() => {
        setVisibleRows(v => v + 2); // Show 2 more rows every 3 seconds
      }, rowDelay);
      return () => clearTimeout(timer);
    }
  }, [visibleRows, images.length]);
  const visibleImages = images.slice(0, visibleRows * imagesPerRow);
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
        className="gallery-grid-responsive"
      >
        {images.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16 }}>No images yet.</div>
        ) : (
          visibleImages.map(img => (
            <img
              key={img._id}
              src={img.url}
              alt={img.filename}
              style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 16px #bbb' }}
            />
          ))
        )}
      </div>
      <style>{`
        @media (max-width: 1200px) {
          .gallery-grid-responsive {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .gallery-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .gallery-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
