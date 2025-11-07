// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-router-dom to avoid module resolution issues in Jest
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    BrowserRouter: ({ children }) => React.createElement('div', null, children),
    Routes: ({ children }) => React.createElement('div', null, children),
    Route: ({ element }) => element || null,
    Navigate: () => null,
    Link: ({ children, ...props }) => React.createElement('a', props, children),
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
  };
});
