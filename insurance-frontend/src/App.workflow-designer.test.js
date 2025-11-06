// Frontend System/Interaction Test
//This file tests the user flow from login to your new page.

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
let store = {};
Storage.prototype.setItem = jest.fn((key, value) => {
  store[key] = value;
});
Storage.prototype.getItem = jest.fn((key) => store[key]);
Storage.prototype.clear = jest.fn(() => {
  store = {};
});

// Mock React Flow
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
  // THIS IS THE MISSING PIECE:
  useReactFlow: () => ({
    setNodes: jest.fn(),
    setEdges: jest.fn(),
    project: jest.fn((coords) => coords), // Mocks the 'project' function
  }),
}));

describe('Admin Workflow Designer Flow', () => {

  beforeEach(() => {
    // Clear mocks before each test
    global.fetch.mockClear();
    store = {}; // Clear mock localStorage
  });

  const mockAdminLogin = () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/auth/login')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'mock-admin-token',
            user: {
              email: 'admin@example.com',
              isAdmin: true,
            },
          }),
        });
      }
      if (url.includes('/api/admin/workflows')) {
         return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{
            workflow_id: 'CLAIM_APPROVAL_V1',
            workflow_name: 'Standard Claim Approval',
            description: 'Test workflow'
          }]),
        });
      }
      if (url.includes('/definition')) {
         return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ definition: { nodes: [], edges: [] } }),
        });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
  };

  it('allows an admin to log in and navigate to the visual workflow designer', async () => {
    mockAdminLogin();
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    // 1. Log in as Admin
    await userEvent.type(screen.getByPlaceholderText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // 2. Wait for admin dashboard and find nav link
    // We assume a nav link with "Workflow" in the name is in the AppShell
    const workflowLink = await screen.findByRole('link', { name: /workflow/i });
    expect(workflowLink).toBeInTheDocument();

    // 3. Navigate to Workflow List
    await userEvent.click(workflowLink);

    // 4. Find the "Edit Workflow (Visual)" link in the list
    const visualEditLink = await screen.findByRole('link', { name: /edit workflow \(visual\)/i });
    expect(visualEditLink).toBeInTheDocument();

    // 5. Click the link to go to the designer
    await userEvent.click(visualEditLink);

    // 6. Assert that the designer page has loaded
    await waitFor(() => {
      expect(screen.getByText(/visual designer/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save workflow/i })).toBeInTheDocument();
    });

    // Check that we are "on" the right page
    expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();
  });
});