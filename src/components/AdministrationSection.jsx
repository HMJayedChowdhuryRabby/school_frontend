import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function AdministrationSection() {
  const [profiles, setProfiles] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios.get('/api/admin-profiles')
      .then(res => setProfiles(res.data))
      .catch(() => setProfiles([]));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24, textAlign: 'center', color: '#1976d2' }}>Administration</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {profiles.map(profile => {
          const isExpanded = expanded[profile._id];
          const showReadMore = profile.message && profile.message.length > 300;
          return (
            <div key={profile._id} style={{ width: 260, borderRadius: 12, boxShadow: '0 4px 16px #bbb', background: '#fff', padding: 18, textAlign: 'center' }}>
              <img src={profile.photoUrl} alt={profile.name} style={{ width: '100%', height: 285, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ fontWeight: 700, fontSize: 22, marginTop: 12 }}>{profile.name}</div>
              <div style={{ fontWeight: 500, fontSize: 16, color: '#1976d2', marginBottom: 8 }}>{profile.role}</div>
              <div style={{ fontSize: 15, color: '#000', whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: isExpanded ? 'none' : 5, WebkitBoxOrient: 'vertical' }}>
                {profile.message}
              </div>
              {showReadMore && !isExpanded && (
                <button style={{ color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: 4 }} onClick={() => setExpanded(e => ({ ...e, [profile._id]: true }))}>
                  Read more
                </button>
              )}
              {showReadMore && isExpanded && (
                <button style={{ color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: 4 }} onClick={() => setExpanded(e => ({ ...e, [profile._id]: false }))}>
                  Show less
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
