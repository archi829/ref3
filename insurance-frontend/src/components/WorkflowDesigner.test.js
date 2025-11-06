//frontend unit test -- tests the component in isolation

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactFlowProvider } from 'reactflow';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WorkflowDesigner from './WorkflowDesigner';


// Mock React Flow
jest.mock('reactflow', () => ({
  ...jest.requireActual('reactflow'),
  ReactFlow: (props) => <div data-testid="react-flow-mock">{props.children}</div>,
  Controls: () => <div data-testid="controls-mock" />,
  Background: () => <div data-testid="background-mock" />,
  MiniMap: () => <div data-testid="minimap-mock" />,
  applyNodeChanges: jest.fn((changes, nodes) => nodes),
  applyEdgeChanges: jest.fn((changes, edges) => edges),
  addEdge: jest.fn((edge, edges) => [edge, ...edges]),
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
Storage.prototype.getItem = jest.fn(() => 'mock-token');

const setup = (workflowId) => {
  // Reset mocks before each setup
  global.fetch.mockClear();

  // Mock fetch responses
  const mockFetch = (url) => {
    if (url.includes('/definition')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ definition: { nodes: [], edges: [] } }),
      });
    }
    if (url.includes(`/api/admin/workflows/${workflowId}`)) {
       return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ workflow_name: 'Test Workflow' }),
      });
    }
    return Promise.resolve({ ok: false });
  };
  
  global.fetch.mockImplementation(mockFetch);

  render(
    <MemoryRouter initialEntries={[`/admin/workflow-designer/${workflowId}`]}>
      <ReactFlowProvider>{/* <--- ADD THIS WRAPPER */}
        <Routes>
          <Route path="/admin/workflow-designer/:workflowId" element={<WorkflowDesigner />} />
        </Routes>
      </ReactFlowProvider> {/* <--- AND THIS WRAPPER */}
    </MemoryRouter>
  );
};

describe('WorkflowDesigner', () => {

  /**
   * Test 1: Load Test
   */
  it('loads the workflow name and definition on render', async () => {
    setup('CLAIM_APPROVAL_V1');

    // Wait for loading to finish and data to be fetched
    await waitFor(() => {
      // Check if workflow name is fetched and displayed
      expect(screen.getByText('Visual Designer: Test Workflow')).toBeInTheDocument();
    });

    // Check that fetch was called twice (once for name, once for definition)
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/workflows/CLAIM_APPROVAL_V1',
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/workflows/CLAIM_APPROVAL_V1/definition',
      expect.any(Object)
    );
  });

  /**
   * Test 2: Save Test
   */
  it('calls the PUT endpoint with the correct payload on save', async () => {
    setup('CLAIM_APPROVAL_V1');

    // Wait for the page to load
    await screen.findByText('Save Workflow');

    // Mock a successful save response
    global.fetch.mockImplementation((url) => {
      if (url.includes('/definition') && url.includes('PUT')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Saved!' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Click the save button
    const saveButton = screen.getByText('Save Workflow');
    await userEvent.click(saveButton);

    // Check that the PUT request was sent
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/workflows/CLAIM_APPROVAL_V1/definition',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          // The body will be the default empty nodes/edges from our load mock
          body: JSON.stringify({ definition: { nodes: [], edges: [] } }),
        })
      );
    });

    // Check if success alert was shown
    expect(window.alert).toHaveBeenCalledWith('Workflow saved successfully!');
  });
});