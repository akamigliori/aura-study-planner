/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Button } from '../../src/components/ui/Button';

describe('Button component', () => {
  test('renders children and applies default primary variant and md size', () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    // default variant primary class
    expect(btn).toHaveClass('bg-primary-600');
    // default size md class
    expect(btn).toHaveClass('px-4');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    const btn = screen.getByRole('button', { name: /press/i });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeDisabled();
  });
});
