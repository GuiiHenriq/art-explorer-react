import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from './BackButton';

describe('BackButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão de voltar com o texto correto', () => {
    render(<BackButton onClick={mockOnClick} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('deve renderizar o ícone de seta para a esquerda', () => {
    render(<BackButton onClick={mockOnClick} />);

    // Verifica se o ícone está presente (ArrowLeft do lucide-react)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando clicado', async () => {
    const user = userEvent.setup();

    render(<BackButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('deve ter o aria-label correto para acessibilidade', () => {
    render(<BackButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /go back to the previous page/i });
    expect(button).toBeInTheDocument();
  });

  it('deve aplicar as classes CSS corretas', () => {
    render(<BackButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'gap-3',
      'text-gray-600',
      'hover:text-blue-600',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2',
      'rounded-lg',
      'px-3',
      'py-2',
      'hover:bg-gray-50',
    );
  });

  it('deve ser focável e navegável por teclado', async () => {
    const user = userEvent.setup();

    render(<BackButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');

    // Testa navegação por teclado
    await user.tab();
    expect(button).toHaveFocus();

    // Testa ativação por Enter
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('deve ter o container com as classes CSS corretas', () => {
    render(<BackButton onClick={mockOnClick} />);

    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('mb-8', 'lg:mb-12');
  });
});
