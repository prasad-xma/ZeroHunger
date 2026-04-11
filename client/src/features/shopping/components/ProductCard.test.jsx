import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from './ProductCard';

vi.mock('lucide-react', () => ({
  ShoppingCart: () => null,
  Plus: () => null,
  Edit: () => null,
  Trash2: () => null,
  Check: () => null,
  DollarSign: () => null,
  AlertTriangle: () => null,
  Heart: () => null,
  X: () => null,
}));

const mockProduct = {
  id: 'ing_001',
  name: 'Tomato',
  quantity: 2,
  unit: 'kg',
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name and quantity correctly', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('2 kg')).toBeInTheDocument();
  });

  it('shows "Add to List" button when not in list', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const addButton = screen.getByText('Add to List');
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('shows "In List" and disables the button when isInList is true', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={true}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const inListButton = screen.getByText('In List');
    expect(inListButton).toBeInTheDocument();
    expect(inListButton.closest('button')).toBeDisabled();
  });

  it('calls onAddToList with product and price object when Add to List is clicked', () => {
    const onAddToList = vi.fn();
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={onAddToList}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Add to List'));
    expect(onAddToList).toHaveBeenCalledTimes(1);
    expect(onAddToList).toHaveBeenCalledWith(mockProduct, { price: 0 });
  });

  it('renders a price input field with placeholder "Enter price"', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Enter price')).toBeInTheDocument();
  });

  it('clicking Edit icon switches to edit mode and shows name input', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle('Edit ingredient'));
    const nameInput = screen.getByDisplayValue('Tomato');
    expect(nameInput).toBeInTheDocument();
  });

  it('clicking Save in edit mode calls onUpdate with product id and updated fields', () => {
    const onUpdate = vi.fn();
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle('Edit ingredient'));
    const nameInput = screen.getByDisplayValue('Tomato');
    fireEvent.change(nameInput, { target: { value: 'Cherry Tomato' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onUpdate).toHaveBeenCalledWith('ing_001', expect.objectContaining({ name: 'Cherry Tomato' }));
  });

  it('clicking Cancel in edit mode exits edit mode without calling onUpdate', () => {
    const onUpdate = vi.fn();
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle('Edit ingredient'));
    const nameInput = screen.getByDisplayValue('Tomato');
    fireEvent.change(nameInput, { target: { value: 'Cherry Tomato' } });
    fireEvent.click(screen.getByText('Cancel'));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('clicking Trash2 icon shows delete confirmation with "Delete?", "Cancel", "OK"', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle('Delete ingredient'));
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('clicking Cancel in delete confirm hides the dialog and shows Trash2 again', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle('Delete ingredient'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Delete?')).toBeNull();
    expect(screen.getByTitle('Delete ingredient')).toBeInTheDocument();
  });

  it('clicking OK in delete confirm calls onDelete with product id', () => {
    const onDelete = vi.fn();
    render(
      <ProductCard
        product={mockProduct}
        onAddToList={vi.fn()}
        isInList={false}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByTitle('Delete ingredient'));
    fireEvent.click(screen.getByText('OK'));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('ing_001');
  });
});
