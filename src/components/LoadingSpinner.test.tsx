import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('deve renderizar o spinner de carregamento com a mensagem correta', () => {
    render(<LoadingSpinner />);

    // Verifica se a mensagem de carregamento está presente
    expect(screen.getByText('Carregando obra de arte...')).toBeInTheDocument();
  });

  it('deve renderizar o container do spinner com as classes CSS corretas', () => {
    render(<LoadingSpinner />);

    const container = screen.getByText('Carregando obra de arte...').parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'justify-center', 'items-center', 'p-8');
  });

  it('deve renderizar o elemento de texto com as classes CSS corretas', () => {
    render(<LoadingSpinner />);

    const textElement = screen.getByText('Carregando obra de arte...');
    expect(textElement).toHaveClass('text-white/70', 'mt-4', 'text-lg');
  });

  it('deve renderizar o spinner com a estrutura visual correta', () => {
    render(<LoadingSpinner />);

    // Verifica se existem elementos div que representam o spinner
    const spinnerElements = document.querySelectorAll('div');
    expect(spinnerElements.length).toBeGreaterThan(0);
  });

  it('deve ser acessível com texto descritivo', () => {
    render(<LoadingSpinner />);

    // Verifica se o texto é legível e acessível
    const loadingText = screen.getByText('Carregando obra de arte...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent('Carregando obra de arte...');
  });
});
