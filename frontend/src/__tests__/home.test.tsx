/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';



// Replace these imports with the actual paths/names in your project:
import { BlogPostServiceContext } from '../services/BlogPostServiceContext';
// If you have a provider component, you can use that instead.
// import { BlogPostServiceProvider } from '../context/BlogPostServiceContext';

// The BlogPost type from your app (optional)
import { BlogPost } from '../types';

const mockPosts: BlogPost[] = [
  { id: '1', authors: [], title: 'First post', description: 'One', /* other props as required */ } as any,
  { id: '2', authors: [], title: 'Second post', description: 'Two' } as any,
  { id: '3', authors: [], title: 'Third post', description: 'Three' } as any,
  { id: '4', authors: [], title: 'Fourth post', description: 'Four' } as any,
  { id: '5', authors: [], title: 'Fifth post', description: 'Five' } as any,
  { id: '6', authors: [], title: 'Sixth post', description: 'Six' } as any,
];

describe('Home route with mocked service via context', () => {
  test('renders home heading and posts when service returns data', async () => {
    // Create a fake service matching BlogPostService interface
    const fakeService = {
      get: jest.fn().mockResolvedValue(mockPosts),
      getById: jest.fn().mockImplementation(async (id: string) =>
        mockPosts.find((p) => p.id === id) ?? null
      ),
    };

    render(
      <MemoryRouter initialEntries={['/']}>
        {/* Provide the fakeService through the same context your app uses */}
        <BlogPostServiceContext.Provider value={fakeService as any}>
          <App />
        </BlogPostServiceContext.Provider>
      </MemoryRouter>
    );

    // Wait for the blog heading to appear (adjust regex to match your heading)
    const heading = await screen.findByRole('heading', { name: /home/i });
    expect(heading).toBeInTheDocument();

    // Check that a mocked post rendered
    expect(await screen.findByText(/First post/i)).toBeInTheDocument();

    // Optional: ensure the service method was called
    expect(fakeService.get).toHaveBeenCalled();
  });
});
