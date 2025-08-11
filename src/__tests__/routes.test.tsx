// src/__tests__/routes.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

type RouteSpec = {
  path: string;
  // A function that returns a Promise of an assertion helper.
  assert: () => Promise<unknown>;
};

const routes: RouteSpec[] = [
  { path: '/',            assert: () => screen.findByRole('heading', { name: /home/i }) },
  { path: '/features',    assert: () => screen.findByRole('heading', { name: /features/i }) },
  { path: '/testimonials',assert: () => screen.findByRole('heading', { name: /testimonials/i }) },
  { path: '/highlights',  assert: () => screen.findByRole('heading', { name: /highlights/i }) },
  { path: '/pricing',     assert: () => screen.findByRole('heading', { name: /pricing/i }) },
  { path: '/faq',         assert: () => screen.findByRole('heading', { name: /faq/i }) },
  { path: '/about',       assert: () => screen.findByRole('heading', { name: /about/i }) },
  { path: '/careers',     assert: () => screen.findByRole('heading', { name: /careers/i }) },
  { path: '/press',       assert: () => screen.findByRole('heading', { name: /press/i }) },
  { path: '/terms',       assert: () => screen.findByRole('heading', { name: /terms/i }) },
  { path: '/privacy',     assert: () => screen.findByRole('heading', { name: /privacy/i }) },
  { path: '/contact',     assert: () => screen.findByRole('heading', { name: /contact/i }) },
];

function renderWithRouter(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('route smoke tests', () => {
  // If pages do async work, mock or stub them here (see commented example above)

  routes.forEach(({ path, assert }) => {
    test(`renders ${path}`, async () => {
      renderWithRouter(path);

      const result = await assert();
      
      // If you want a minimal assertion that it exists:
      expect(result).toBeTruthy();
    });
  });
});
