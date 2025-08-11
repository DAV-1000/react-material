import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Replace these imports with the actual paths/names in your project:
import { BlogPostServiceContext } from '../services/BlogPostServiceContext';
// If you have a provider component, you can use that instead.
// import { BlogPostServiceProvider } from '../context/BlogPostServiceContext';

// The BlogPost type from your app (optional)
import { BlogPost } from '../types';

const mockPosts: BlogPost[] = [
  { id: '1', title: 'First post', excerpt: 'One', /* other props as required */ } as any,
  { id: '2', title: 'Second post', excerpt: 'Two' } as any,
];

describe('Blog route with mocked service via context', () => {
  test('renders blog heading and posts when service returns data', async () => {
    // Create a fake service matching BlogPostService interface
    const fakeService = {
      getAll: jest.fn().mockResolvedValue(mockPosts),
      getById: jest.fn().mockImplementation(async (id: string) =>
        mockPosts.find((p) => p.id === id) ?? null
      ),
    };

    render(
      <MemoryRouter initialEntries={['/blog']}>
        {/* Provide the fakeService through the same context your app uses */}
        <BlogPostServiceContext.Provider value={fakeService as any}>
          <App />
        </BlogPostServiceContext.Provider>
      </MemoryRouter>
    );

    // Wait for the blog heading to appear (adjust regex to match your heading)
    const heading = await screen.findByRole('heading', { name: /posts/i });
    expect(heading).toBeInTheDocument();

    // Check that a mocked post rendered
    expect(await screen.findByText(/First post/i)).toBeInTheDocument();

    // Optional: ensure the service method was called
    expect(fakeService.getAll).toHaveBeenCalled();
  });
});
