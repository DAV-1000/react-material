import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('navigates from Home to About page', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /Home/i })).toBeInTheDocument();

  await user.click(screen.getByRole('link', { name: /About/i }));

  expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
});
