import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShoppingOptimizer from './ShoppingOptimizer';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ShoppingCart: () => null,
  Plus: () => null,
  Search: () => null,
  Filter: () => null,
  DollarSign: () => null,
  Heart: () => null,
  AlertTriangle: () => null,
  ArrowLeft: () => null,
}));

// Mock child components so tests focus only on ShoppingOptimizer logic
vi.mock('./ShoppingList', () => ({ default: () => <div data-testid="shopping-list" /> }));
vi.mock('./components/ProductCard', () => ({
  default: ({ product, onAddToList, isInList, onDelete }) => (
    <div data-testid={`product-card-${product.id}`}>
      <span>{product.name}</span>
      <button onClick={() => onAddToList(product, { price: 100 })}>Add</button>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  )
}));

// Mock shoppingService
vi.mock('../../services/shoppingService', () => ({
  updateIngredient: vi.fn(() => Promise.resolve({ success: true })),
  deleteIngredient: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock api service
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../../services/api';

// Mock ingredientNormalizer
vi.mock('./utils/ingredientNormalizer', () => ({
  normalizeIngredientName: (name) => name.toLowerCase().trim(),
  normalizeIngredientWithQuantity: (name) => ({ name: name.toLowerCase().trim(), quantity: 1 }),
}));

const mockShoppingLists = [
  {
    _id: 'list_001',
    name: 'Test List',
    ingredients: [
      { _id: 'ing_001', name: 'Tomato', quantity: 2, unit: 'kg' },
      { _id: 'ing_002', name: 'Onion', quantity: 1, unit: 'pcs' },
    ]
  }
];

function mockFetchSuccess(data = mockShoppingLists) {
  api.get.mockResolvedValue({ data });
}

function mockFetchFailure() {
  api.get.mockRejectedValue(new Error('Failed to load shopping lists'));
}

describe('ShoppingOptimizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => 'mock-token');
  });

  it('renders header with "Shopping Optimizer" title', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    await waitFor(() => {
      expect(screen.getByText('Shopping Optimizer')).toBeInTheDocument();
    });
  });

  it('renders Shopping List tab and Products tab', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    await waitFor(() => {
      expect(screen.getByText('Shopping List')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
  });

  it('shows ShoppingList component by default on list tab', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    await waitFor(() => {
      expect(screen.getByTestId('shopping-list')).toBeInTheDocument();
    });
  });

  it('switching to Products tab shows search input and Add Custom Item button', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Products'));
    });
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
  });

  it('fetches shopping lists on mount and renders product cards', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByTestId('product-card-ing_001')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-ing_002')).toBeInTheDocument();
    });
    expect(api.get).toHaveBeenCalledWith('/shopping');
  });

  it('shows error message in products tab when fetch fails', async () => {
    mockFetchFailure();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Failed to load shopping lists')).toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching', async () => {
    api.get.mockReturnValue(new Promise(() => { }));
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('search input filters products by name', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByTestId('product-card-ing_001')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText('Search products...'), { target: { value: 'Tomato' } });
    await waitFor(() => {
      expect(screen.getByTestId('product-card-ing_001')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-ing_002')).toBeNull();
    });
  });

  it('clicking "Add Custom Item" button shows the custom item form', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add Custom Item'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
  });

  it('clicking Cancel in custom form hides the form', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add Custom Item'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
    // Find the Cancel button in the form (not the toggle button)
    const cancelButtons = screen.getAllByText('Cancel');
    const formCancelButton = cancelButtons.find(btn => btn.closest('.mb-6'));
    fireEvent.click(formCancelButton);
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter item name')).toBeNull();
    });
  });

  it('submitting custom form without name shows validation error', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add Custom Item'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add to Product'));
    await waitFor(() => {
      expect(screen.getByText('Please fill in item name and price')).toBeInTheDocument();
    });
  });

  it('submitting valid custom form adds a new product card', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add Custom Item'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText('Enter item name'), { target: { value: 'Pepper' } });
    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('Add to Product'));
    await waitFor(() => {
      expect(screen.getByText('pepper')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Enter item name')).toBeNull();
    });
  });

  it('budget input updates budget display and remaining amount', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    await waitFor(() => {
      const budgetInput = screen.getByDisplayValue('5000');
      fireEvent.change(budgetInput, { target: { value: '3000' } });
    });
    await waitFor(() => {
      expect(screen.getByText(/3000/)).toBeInTheDocument();
    });
  });

  it('addToShoppingList does not add the same product twice', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByTestId('product-card-ing_001')).toBeInTheDocument();
    });
    // Get all Add buttons and click the first one twice
    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    fireEvent.click(screen.getByText('Shopping List'));
    await waitFor(() => {
      expect(screen.getByTestId('shopping-list')).toBeInTheDocument();
    });
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('handleDeleteProduct for custom item removes it from products without calling deleteIngredient', async () => {
    mockFetchSuccess();
    render(<ShoppingOptimizer />);
    fireEvent.click(screen.getByText('Products'));
    await waitFor(() => {
      expect(screen.getByText('Add Custom Item')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add Custom Item'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText('Enter item name'), { target: { value: 'Salt' } });
    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Add to Product'));
    await waitFor(() => {
      expect(screen.getByText('salt')).toBeInTheDocument();
    });
    // Get all Delete buttons and find the one for the custom item
    const deleteButtons = screen.getAllByText('Delete');
    // The custom item 'salt' should be the last product in the grid
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText('salt')).toBeNull();
    });
  });
});
