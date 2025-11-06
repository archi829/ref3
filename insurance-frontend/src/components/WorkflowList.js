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
        // Using relative path for proxy
        const response = await fetch('/api/admin/workflows', { 
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
    // Reverting the centering div to match your original layout
    <div className="workflow-list-container card-container"> 
      <h2>Manage Workflows</h2>
      {workflows.length === 0 ? (
        <p>No workflows found.</p>
      ) : (
        <>
          <table className="claims-table"> 
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                {/* ✅ 1. Updated headers for clarity */}
                <th>Text Editor</th> 
                <th>Visual Editor</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map(wf => (
                <tr key={wf.workflow_id}>
                  <td>{wf.workflow_id}</td>
                  <td>{wf.name}</td>
                  <td>{wf.description || '-'}</td>
                  
                  {/* ✅ 2. Added link to the Text Editor */}
                  <td>
                    <Link to={`/admin/workflow-editor/${wf.workflow_id}`}>
                      <button className="action-button view-button">Edit Steps</button>
                    </Link>
                  </td>
                  
                  {/* ✅ 3. Added link to the Visual Designer */}
                  <td>
                    <Link to={`/admin/workflow-designer/${wf.workflow_id}`}>
                      <button className="action-button">Edit Visual</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ 4. Removed the old "Quick Edit Links" list */}
        </>
      )}
    </div>
  );
}

export default WorkflowList;