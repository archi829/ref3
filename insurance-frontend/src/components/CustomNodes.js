import React from 'react';
import { Handle, Position } from 'reactflow';

// ✅ New high-contrast style
export function RuleNode({ data }) {
  const style = {
    background: '#d6e4ff', // Darker blue
    border: '1px solid #4a69bd', // Strong blue border
    borderRadius: '4px', 
    padding: '10px 15px', 
    minWidth: 150,
    color: '#222', // Dark text
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      
      <div>
        <strong>Rule</strong>
      </div>
      <div style={{ fontSize: '12px' }}>
        {data.label || 'Unnamed Rule'}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ✅ New high-contrast style
export function ManualTaskNode({ data }) {
  const style = {
    background: '#fff0b3', // Darker yellow
    border: '1px solid #d4a017', // Strong yellow/gold border
    borderRadius: '4px', 
    padding: '10px 15px', 
    minWidth: 150,
    color: '#222', // Dark text
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      
      <div>
        <strong>Manual Task</strong>
      </div>
      <div style={{ fontSize: '12px' }}>
        {data.label || 'Unnamed Task'}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}