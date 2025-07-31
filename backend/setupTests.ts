process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MET_API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

beforeAll(() => {
});

afterAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(10000);
