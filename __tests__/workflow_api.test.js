// __tests__/workflow_api.test.js

const request = require('supertest');
const { app, server, task } = require('../server'); // Import 'task'
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken'); // Import jwt

// Mock the database
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn(),
}));

// Mock the jsonwebtoken library
jest.mock('jsonwebtoken');

describe('Workflow Definition API', () => {
  let mockConnection;
  let serverInstance;

  beforeAll((done) => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    // Use a random port for tests
    serverInstance = app.listen(0, () => {
      console.log('Test server started on random port');
      done();
    });
  });

  afterAll((done) => {
    // Cleanup all resources
    const cleanup = async () => {
      // Stop the cron job
      if (task) {
        task.stop();
      }
      
      // Close server
      if (serverInstance) {
        await new Promise(resolve => serverInstance.close(resolve));
      }

      // Reset environment
      delete process.env.NODE_ENV;
      
      // Clear all mocks
      jest.clearAllMocks();
      
      done();
    };
    
    cleanup().catch(done);
  });

  beforeEach(() => {
    // Reset mocks before each test
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);

    // Mock the jwt.verify function to return a fake admin user
    // with the EXACT properties expected by checkAuth and checkAdmin middleware
    jwt.verify.mockImplementation((token, secret) => {
      if (!token) throw new Error('No token provided');
      return {
        admin_id: 'TEST_ADMIN_ID',
        role: 'System Admin',
        isAdmin: true
      };
    });
  });

  const workflowId = 'CLAIM_APPROVAL_V1';
  const sampleDefinition = {
    nodes: [{ id: '1', type: 'input', data: { label: 'Start' }, position: { x: 0, y: 0 } }],
    edges: [],
  };

  /**
   * Test 1: Save a workflow definition
   */
  it('should save a workflow definition via PUT request', async () => {
    mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(serverInstance)
      .put(`/api/admin/workflows/${workflowId}/definition`)
      .set('Authorization', 'Bearer valid-test-token')
      .send({ definition: sampleDefinition });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('updated successfully');
    
    expect(mockConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE workflows SET definition_json'),
      [JSON.stringify(sampleDefinition), workflowId]
    );
  });

  /**
   * Test 2: Load a workflow definition
   */
  it('should load a workflow definition via GET request', async () => {
    const dbRow = [{ workflow_id: workflowId, definition_json: JSON.stringify(sampleDefinition) }];
    mockConnection.execute.mockResolvedValue([dbRow]);

    const response = await request(serverInstance)
      .get(`/api/admin/workflows/${workflowId}/definition`)
      .set('Authorization', 'Bearer valid-test-token');

    expect(response.status).toBe(200);
    expect(response.body.definition).toEqual(sampleDefinition);

    expect(mockConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining('SELECT definition_json FROM workflows'),
      [workflowId]
    );
  });

  /**
   * Test 3: Handle loading a non-existent workflow
   */
  it('should return 404 for a non-existent workflow ID', async () => {
    mockConnection.execute.mockResolvedValue([[]]); // Simulate no rows found

    const response = await request(serverInstance)
      .get('/api/admin/workflows/FAKE_ID/definition')
      .set('Authorization', 'Bearer valid-test-token');

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });
});