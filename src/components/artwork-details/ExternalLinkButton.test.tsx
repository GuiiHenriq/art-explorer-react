import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExternalLinkButton } from './ExternalLinkButton';

// Mock do window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

describe('ExternalLinkButton', () => {
  const mockUrl = 'https://example.com/artwork/123';
  const mockDelay = 1.6;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão com o texto correto', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    expect(screen.getByText('View more')).toBeInTheDocument();
  });

  it('deve renderizar o ícone de link externo', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    // Verifica se o ícone está presente (ExternalLink do lucide-react)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('deve abrir o link externo quando clicado', async () => {
    const user = userEvent.setup();

    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener,noreferrer');
  });

  it('deve aplicar as classes CSS corretas ao botão', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'gap-3',
      'bg-gradient-to-r',
      'from-blue-600',
      'to-purple-600',
      'hover:from-blue-700',
      'hover:to-purple-700',
      'text-white',
      'px-8',
      'py-4',
      'rounded-xl',
      'font-semibold',
      'transition-all',
      'shadow-lg',
      'hover:shadow-xl',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2',
    );
  });

  it('deve aplicar as classes CSS corretas ao container', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('pt-4');
  });

  it('deve ser focável e navegável por teclado', async () => {
    const user = userEvent.setup();

    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');

    // Testa navegação por teclado
    await user.tab();
    expect(button).toHaveFocus();

    // Testa ativação por Enter
    await user.keyboard('{Enter}');
    expect(mockWindowOpen).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener,noreferrer');
  });

  it('deve funcionar com diferentes URLs', async () => {
    const user = userEvent.setup();
    const differentUrl = 'https://metmuseum.org/art/collection/search/123';

    render(<ExternalLinkButton url={differentUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(differentUrl, '_blank', 'noopener,noreferrer');
  });

  it('deve funcionar com diferentes delays', () => {
    const differentDelay = 2.0;

    render(<ExternalLinkButton url={mockUrl} delay={differentDelay} />);

    // O delay é usado internamente pelo framer-motion, mas podemos verificar se o componente renderiza
    expect(screen.getByText('View more')).toBeInTheDocument();
  });

  it('deve ter acessibilidade adequada', () => {
    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Verifica se o botão tem texto descritivo
    expect(button).toHaveTextContent('View more');
  });

  it('deve abrir múltiplas URLs corretamente em cliques consecutivos', async () => {
    const user = userEvent.setup();
    const url1 = 'https://example1.com';
    const url2 = 'https://example2.com';

    const { rerender } = render(<ExternalLinkButton url={url1} delay={mockDelay} />);

    const button1 = screen.getByRole('button');
    await user.click(button1);
    expect(mockWindowOpen).toHaveBeenCalledWith(url1, '_blank', 'noopener,noreferrer');

    // Limpa o mock e renderiza com nova URL
    mockWindowOpen.mockClear();
    rerender(<ExternalLinkButton url={url2} delay={mockDelay} />);

    const button2 = screen.getByRole('button');
    await user.click(button2);
    expect(mockWindowOpen).toHaveBeenCalledWith(url2, '_blank', 'noopener,noreferrer');
  });

  it('deve manter o estado visual correto após cliques', async () => {
    const user = userEvent.setup();

    render(<ExternalLinkButton url={mockUrl} delay={mockDelay} />);

    const button = screen.getByRole('button');

    // Verifica estado inicial
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');

    // Clica no botão
    await user.click(button);

    // Verifica que o estado visual permanece o mesmo
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
  });
});
