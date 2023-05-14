import { render, screen } from '@testing-library/react';
import App from './main';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Timer:/i);
  expect(linkElement).toBeInTheDocument();
});
