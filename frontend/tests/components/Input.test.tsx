import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Input } from '../../src/components/ui/Input';

describe('Input component', () => {
  test('renders with placeholder', () => {
    render(<Input placeholder="Digite algo" />);
    const input = screen.getByPlaceholderText('Digite algo');
    expect(input).toBeInTheDocument();
  });

  test('calls onChange when user types', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('applies disabled prop', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
