import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RuleNode, ManualTaskNode } from './CustomNodes';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 } }
];

function WorkflowDesigner() {
  const { workflowId } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [workflowName, setWorkflowName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ State for the new edit modal
  const [editingNode, setEditingNode] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');

  const reactFlowInstance = useReactFlow();
  const nodeIdCounter = useRef(2);

  const nodeTypes = useMemo(() => ({
    rule: RuleNode,
    manual: ManualTaskNode,
  }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // ✅ LOOP FIX: This effect ONLY fetches data
  useEffect(() => {
    const fetchWorkflow = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      try {
        const nameRes = await fetch(`/api/admin/workflows/${workflowId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (nameRes.ok) {
          const nameData = await nameRes.json();
          setWorkflowName(nameData.name || 'Workflow');
        }

        const defRes = await fetch(`/api/admin/workflows/${workflowId}/definition`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        if (!defRes.ok) throw new Error('Failed to fetch workflow definition');
        const defData = await defRes.json();

        if (defData.definition) {
          setNodes(defData.definition.nodes || initialNodes);
          setEdges(defData.definition.edges || []); // Load saved edges

          // Update counter to avoid ID conflicts
          (defData.definition.nodes || []).forEach(node => {
            const num = parseInt(node.id.split('_')[1]);
            if (!isNaN(num) && num >= nodeIdCounter.current) {
              nodeIdCounter.current = num + 1;
            }
          });
        } else {
          setNodes(initialNodes);
          setEdges([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // ⛔️ Removed fitView from here
      }
    };
    fetchWorkflow();
  }, [workflowId]); // ✅ LOOP FIX: Removed reactFlowInstance dependency

  // ✅ LOOP FIX: This new effect handles fitting the view *after* loading
  useEffect(() => {
    if (!loading && reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
      }, 10);
    }
  }, [loading, reactFlowInstance, nodes]);

  const onSave = useCallback(async () => {
    setError(null);
    const token = localStorage.getItem('token');
    
    const payload = {
      definition: { nodes, edges }
    };

    try {
      const res = await fetch(`/api/admin/workflows/${workflowId}/definition`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save workflow');
      }
      alert('Workflow saved successfully!');
    } catch (err) {
      setError(err.message);
      alert(`Error saving workflow: ${err.message}`);
    }
  }, [nodes, edges, workflowId]);

  const onAdd = useCallback((nodeType) => {
    if (!reactFlowInstance) return;
    // Project canvas center to flow coordinates
    const position = reactFlowInstance.project({
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100,
    });
    const newNodeId = `node_${nodeIdCounter.current++}`;
    const newNode = {
      id: newNodeId,
      type: nodeType,
      data: { label: nodeType === 'rule' ? 'New Rule' : 'New Manual Task' },
      position: position,
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  // ✅ NEW: Handle double-click by opening the modal
  const onNodeDoubleClick = useCallback((event, node) => {
    // Don't allow renaming the 'Start' node
    if (node.id === '1' || node.type === 'input') {
      return;
    }
    setEditingNode(node);
    setEditingLabel(node.data.label);
  }, []);

  // ✅ NEW: Handle saving the new label from the modal
  const handleLabelSave = () => {
    if (!editingNode || editingLabel === editingNode.data.label) {
      setEditingNode(null);
      return;
    }

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === editingNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label: editingLabel,
            },
          };
        }
        return n;
      })
    );
    
    setEditingNode(null);
    setEditingLabel('');
  };

  // ✅ NEW: Handle canceling the edit
  const handleLabelCancel = () => {
    setEditingNode(null);
    setEditingLabel('');
  };

  if (loading) return <div>Loading workflow designer...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ width: '90%', margin: '0 auto', position: 'relative' }}>
      {/* ✅ NEW: Edit Node Modal */}
      {editingNode && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '300px'
          }}>
            <h3 style={{ margin: 0 }}>Edit Node Label</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Node ID: {editingNode.id}</p>
            <input
              type="text"
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
              autoFocus
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button 
                onClick={handleLabelCancel} 
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', background: '#eee', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLabelSave} 
                style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Visual Designer: {workflowName}</h2>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={onSave} style={{ padding: '8px 12px', marginRight: '10px', cursor: 'pointer' }}>
          Save Workflow
        </button>
        <button
          onClick={() => onAdd('rule')}
          style={{ padding: '8px 12px', marginRight: '10px', background: '#d6e4ff', border: '1px solid #4a69bd', color: '#222', cursor: 'pointer' }}
        >
          Add Rule Node
        </button>
        <button
          onClick={() => onAdd('manual')}
          style={{ padding: '8px 12px', background: '#fff0b3', border: '1px solid #d4a017', color: '#222', cursor: 'pointer' }}
        >
          Add Manual Task
        </button>
      </div>

      <div style={{ height: '80vh', width: '100%', border: '1px solid #ddd', background: '#f9f9f9' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={onNodeDoubleClick} // Add the prop here
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default WorkflowDesigner;