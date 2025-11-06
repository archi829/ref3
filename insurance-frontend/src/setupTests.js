// insurance-frontend/src/setupTests.js

import '@testing-library/jest-dom';

// Fix 1: Mocks localStorage for all Jest tests
// Mocks localStorage for all Jest tests
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    clear() { store = {}; },
    removeItem(key) { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});


// Fix 2: Mocks the 'reactflow' library for all Jest tests
// Mocks the 'reactflow' library for all Jest tests
jest.mock('reactflow', () => ({
  ...jest.requireActual('reactflow'),
  ReactFlow: (props) => <div data-testid="react-flow-mock">{props.children}</div>,
  Controls: () => <div data-testid="controls-mock" />,
  Background: () => <div data-testid="background-mock" />,
  MiniMap: () => <div data-testid="minimap-mock" />,
  applyNodeChanges: jest.fn((changes, nodes) => nodes),
  applyEdgeChanges: jest.fn((changes, edges) => edges),
  addEdge: jest.fn((edge, edges) => [edge, ...edges]),
  // THIS IS THE PIECE THAT FIXES THE CRASH
  useReactFlow: () => ({
    setNodes: jest.fn(),
    setEdges: jest.fn(),
    project: jest.fn((coords) => coords), 
  }),
}));