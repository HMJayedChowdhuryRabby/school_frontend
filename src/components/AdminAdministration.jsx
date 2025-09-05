import React, { useState, useEffect } from "react";
import axios from '../api/axios';

// const roles = ["Headmaster", "Founder", "Chairman"]; // Commented out to allow manual input

export default function AdminAdministration() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    role: "",
    name: "",
    message: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({}); // store expanded states per profile

  // Fetch profiles
  const fetchProfiles = async () => {
    try {
      const res = await axios.get("/api/admin-profiles");
      setProfiles(res.data);
    } catch {
      setProfiles([]);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role || !form.name || !form.message || !form.image) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("role", form.role);
      formData.append("name", form.name);
      formData.append("message", form.message);
      formData.append("image", form.image);

      await axios.post("/api/admin-profiles/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({ role: "", name: "", message: "", image: null });
      fetchProfiles();
    } catch {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this profile?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/admin-profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchProfiles();
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Toggle expand/collapse message
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
        Manage Administration Profiles
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Type Role (e.g. Headmaster)"
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc", minWidth: 120 }}
            required
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            rows={8}
            style={{
              display: "block",
              width: "100%",
              minHeight: 160,
              padding: "10px",
              fontSize: 16,
              lineHeight: 1.6,
              resize: "both",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{}}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !form.role ||
              !form.name ||
              !form.message ||
              !form.image
            }
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#000",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {/* Profiles */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {profiles.map((profile) => (
          <div
            key={profile._id}
            style={{
              position: "relative",
              width: 240,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 8px #ccc",
              padding: 12,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={profile.photoUrl}
              alt={profile.name}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginTop: 8,
              }}
            >
              {profile.name}
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: "#1976d2",
                marginBottom: 8,
              }}
            >
              {profile.role}
            </div>

            {/* Message with expand/collapse */}
            <div
              style={{
                fontSize: 15,
                color: "#333",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                fontWeight: 400,
                lineHeight: 1.6,
                maxHeight: expanded[profile._id] ? "none" : 120,
                overflow: expanded[profile._id] ? "visible" : "hidden",
              }}
            >
              {profile.message}
            </div>
            {profile.message.length > 200 && (
              <button
                onClick={() => toggleExpand(profile._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1976d2",
                  cursor: "pointer",
                  marginTop: 4,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {expanded[profile._id] ? "Show Less" : "Read More"}
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={() => handleDelete(profile._id)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                background: "#e55353",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
