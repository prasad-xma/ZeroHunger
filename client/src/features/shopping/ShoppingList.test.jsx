import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShoppingList from './ShoppingList';

vi.mock('lucide-react', () => ({
  ShoppingCart: () => null,
  Trash2: () => null,
  Check: () => null,
  Plus: () => null,
  Minus: () => null,
  DollarSign: () => null,
  TrendingUp: () => null,
  X: () => null,
}));

vi.mock('./utils/ingredientNormalizer', () => ({
  normalizeIngredientName: (name) => name.toLowerCase().trim(),
}));

const mockItem = {
  product: { id: 'ing_001', name: 'Tomato' },
  quantity: 2,
  checked: false,
  selectedStore: { name: 'No store selected', price: 150 },
};

const defaultProps = {
  shoppingList: [mockItem],
  onRemoveItem: vi.fn(),
  onToggleChecked: vi.fn(),
  onUpdateQuantity: vi.fn(),
  budget: 5000,
  totalCost: 300,
  onBudgetChange: vi.fn(),
  onClearAll: vi.fn(),
  onClearChecked: vi.fn(),
};

describe('ShoppingList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item count and product name', () => {
    render(<ShoppingList {...defaultProps} />);
    expect(screen.getByText('Shopping Items (1)')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('shows empty state when shoppingList is empty', () => {
    render(<ShoppingList {...defaultProps} shoppingList={[]} />);
    expect(screen.getByText('Your shopping list is empty')).toBeInTheDocument();
  });

  it('displays correct total cost in footer', () => {
    render(<ShoppingList {...defaultProps} totalCost={300} />);
    // Query in footer area - there are multiple "LKR 300" so we need to be specific
    const footerCosts = screen.getAllByText('LKR 300');
    expect(footerCosts.length).toBeGreaterThan(0);
  });

  it('clicking the checkbox button calls onToggleChecked with product id', () => {
    const onToggleChecked = vi.fn();
    render(<ShoppingList {...defaultProps} onToggleChecked={onToggleChecked} />);
    const checkboxButton = screen.getByTestId('checkbox-ing_001');
    fireEvent.click(checkboxButton);
    expect(onToggleChecked).toHaveBeenCalledWith('ing_001');
  });

  it('clicking the + button calls onUpdateQuantity with quantity + 1', () => {
    const onUpdateQuantity = vi.fn();
    render(<ShoppingList {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
    const plusButton = screen.getByTestId('plus-ing_001');
    fireEvent.click(plusButton);
    expect(onUpdateQuantity).toHaveBeenCalledWith('ing_001', 3);
  });

  it('clicking the - button calls onUpdateQuantity with quantity - 1', () => {
    const onUpdateQuantity = vi.fn();
    render(<ShoppingList {...defaultProps} onUpdateQuantity={onUpdateQuantity} quantity={2} />);
    const minusButton = screen.getByTestId('minus-ing_001');
    fireEvent.click(minusButton);
    expect(onUpdateQuantity).toHaveBeenCalledWith('ing_001', 1);
  });

  it('minus button is disabled when quantity is 1', () => {
    render(<ShoppingList {...defaultProps} shoppingList={[{ ...mockItem, quantity: 1 }]} />);
    const minusButton = screen.getByTestId('minus-ing_001');
    expect(minusButton).toBeDisabled();
  });

  it('clicking Trash2 shows "Yes, remove" and "Cancel" confirmation', () => {
    render(<ShoppingList {...defaultProps} />);
    const trashButton = screen.getByTestId('delete-ing_001');
    fireEvent.click(trashButton);
    expect(screen.getByTestId('confirm-remove-ing_001')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-delete-ing_001')).toBeInTheDocument();
  });

  it('clicking "Yes, remove" calls onRemoveItem with product id', () => {
    const onRemoveItem = vi.fn();
    render(<ShoppingList {...defaultProps} onRemoveItem={onRemoveItem} />);
    const trashButton = screen.getByTestId('delete-ing_001');
    fireEvent.click(trashButton);
    fireEvent.click(screen.getByTestId('confirm-remove-ing_001'));
    expect(onRemoveItem).toHaveBeenCalledWith('ing_001');
  });

  it('clicking "Cancel" in confirmation hides the dialog', () => {
    render(<ShoppingList {...defaultProps} />);
    const trashButton = screen.getByTestId('delete-ing_001');
    fireEvent.click(trashButton);
    fireEvent.click(screen.getByTestId('cancel-delete-ing_001'));
    expect(screen.queryByTestId('confirm-remove-ing_001')).toBeNull();
  });

  it('"Clear All" is visible and calls onClearAll on click', () => {
    const onClearAll = vi.fn();
    render(<ShoppingList {...defaultProps} onClearAll={onClearAll} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear All'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('"Clear Checked" is hidden when no items are checked', () => {
    render(<ShoppingList {...defaultProps} shoppingList={[{ ...mockItem, checked: false }]} />);
    expect(screen.queryByText('Clear Checked')).toBeNull();
  });

  it('"Clear Checked" is visible and calls onClearChecked when checked items exist', () => {
    const onClearChecked = vi.fn();
    render(<ShoppingList {...defaultProps} shoppingList={[{ ...mockItem, checked: true }]} onClearChecked={onClearChecked} />);
    expect(screen.getByText('Clear Checked')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear Checked'));
    expect(onClearChecked).toHaveBeenCalledTimes(1);
  });

  it('shows "Over Budget" badge when totalCost exceeds budget', () => {
    render(<ShoppingList {...defaultProps} budget={100} totalCost={300} />);
    expect(screen.getByText('Over Budget')).toBeInTheDocument();
  });

  it('shows savings badge when under budget', () => {
    render(<ShoppingList {...defaultProps} budget={5000} totalCost={300} />);
    expect(document.body.textContent).toMatch(/Saved LKR/);
  });
});
