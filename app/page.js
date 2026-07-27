'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  
  // Form States
  const [issueForm, setIssueForm] = useState({ title: '', desc: '', category: 'Roads' });
  const [eventForm, setEventForm] = useState({ title: '', date: '' });

  // Load Data on Page Start
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        console.log('Data recieved', data);
        setIssues(data.issues || []);
        setEvents(data.events || []);
        setWeather(data.weather || null); //Save weather data
      });
  }, []);

  // Submit New Issue
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueForm),
    });
    if (res.ok) {
      const newIssue = await res.json();
      setIssues([...issues, newIssue]);
      setIssueForm({ title: '', desc: '', category: 'Roads' });
    }
  };

  // Upvote an Issue
  const handleVote = async (id) => {
    const res = await fetch('/api/issues', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setIssues(issues.map(img => img.id === id ? updated : img));
    }
  };

  // Submit New Event
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm),
    });
    if (res.ok) {
      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      setEventForm({ title: '', date: '' });
    }
  };

  const temp = weather ? (weather.temperature ?? weather.temperature_2m ?? 'N/A') : null;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '1rem', marginBottom: '2rem' }}>
      <div>
        <h1>Civic Engagement Board</h1>
        <p>Report neighborhood issues and track upcoming municipal events live.</p>
      </div>
      
      {weather && (
          <div style={{ 
            background: '#1e293b', 
            border: '1px solid #334155', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '8px', 
            textAlign: 'right' 
          }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Live Local Weather
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' }}>
              {weather.temperature}°C
            </p>
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        
        {}
        <section>
          <h2>Reported Community Issues</h2>
          
          <form onSubmit={handleIssueSubmit} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', minHeight: '340px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}> 
            <h3 style={{ color: '#0f172a', margin: '0 0 1rem 0' }}>File a New Report</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#334155', fontWeight: 'bold' }}>Issue Title:</label>
              <input type="text" value={issueForm.title} onChange={e => setIssueForm({...issueForm, title: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#334155', fontWeight: 'bold' }}>Description</label>
              <textarea value={issueForm.desc} onChange={e => setIssueForm({...issueForm, desc: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#334155', fontWeight: 'bold' }}>Category:</label>
              <select value={issueForm.category} onChange={e => setIssueForm({...issueForm, category: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                <option value="Roads">Roads & Potholes</option>
                <option value="Parks">Parks & Recreation</option>
                <option value="Utilities">Utilities & Water</option>
                <option value="Safety">Public Safety</option>
              </select>
            </div>
            <button type="submit" style={{ background: '#0070f3', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>Submit Issue</button>
          </form>

          <div>
            {issues.length === 0 ? <p style={{ color: '#94a3b8'}}>No issues reported yet.</p> : issues.map(issue => (
              <div key={issue.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', background: '#fff' }}>
                <span style={{ fontSize: '0.8rem', background: '#e1f5fe', color: '#0288d1', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{issue.category}</span>
                <h4 style={{ margin: '0.5rem 0', color: '#334155' }}>{issue.title}</h4>
                <p style={{ color: '#555', fontSize: '0.95rem' }}>{issue.desc}</p>
                <button onClick={() => handleVote(issue.id)} style={{ background: '#e0e0e0', color: '#334155', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                   Upvote ({issue.votes})
                </button>
              </div>
            ))}
          </div>
        </section>

        {}
        <section>
          <h2>Town Hall & Timeline Schedule</h2>

          <form onSubmit={handleEventSubmit} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#0f172a', margin: '0 0 1rem 0'}}>Schedule a Public Event</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style ={{ color: '#334155', fontWeight: 'bold' }}>Event Name:</label>
              <input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#334155', fontWeight: 'bold' }}>Target Date:</label>
              <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>Add Event</button>
          </form>

          <div style={{ borderLeft: '3px solid #2e7d32', paddingLeft: '1.5rem' }}>
            {events.length === 0 ? <p>No upcoming timeline events listed.</p> : events.map(event => (
              <div key={event.id} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ width: '12px', height: '12px', background: '#2e7d32', borderRadius: '50%', position: 'absolute', left: '-22px', top: '4px' }}></div>
                <strong style={{ color: '#2e7d32' }}>{event.date}</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: '500' }}>{event.title}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}