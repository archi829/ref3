// src/components/WorkflowList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation links

function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/workflows', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Could not fetch workflows.');
        }

        const data = await response.json();
        setWorkflows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []); // Run only once on component mount

  if (loading) return <div>Loading workflows...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="workflow-list-container card-container"> {/* Reusing card style */}
      <h2>Manage Workflows ⚙️</h2>
      <Link to="/admin/workflows/new"> {/* Link to create a new workflow */}
        <button className="button-primary" style={{ width: 'auto', marginBottom: '20px' }}>
          + Create New Workflow
        </button>
      </Link>

      {workflows.length === 0 ? (
        <p>No workflows defined yet.</p>
      ) : (
        <table className="workflows-table"> {/* Similar style to claims table */}
          <thead>
            <tr>
              <th>Workflow ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(wf => (
              <tr key={wf.workflow_id}>
                <td>{wf.workflow_id}</td>
                <td>{wf.name}</td>
                <td>{wf.description || '-'}</td>
                <td>
                  <Link to={`/admin/workflows/${wf.workflow_id}`}>
                    <button className="action-button view-button">Edit</button>
                  </Link>
                  {/* Add Delete button/logic here later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkflowList;