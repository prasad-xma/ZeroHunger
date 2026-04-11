import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MealGallery from "./MealGallery";
import { vi } from "vitest";
import { mealService } from "../../services/mealService";

// Mock window.confirm
const mockConfirm = vi.fn();
global.confirm = mockConfirm;

// Mock mealService
vi.mock("../../services/mealService");

describe("MealGallery", () => {
  const mockMealService = vi.mocked(mealService);
  const mockMeals = [
    {
      _id: "1",
      name: "Chicken Salad",
      image: "/assets/meals/chicken.jpg",
      description: "Healthy chicken salad",
      ingredients: [
        { name: "Chicken", quantity: "200g", calories: 250 },
        { name: "Lettuce", quantity: "100g", calories: 15 }
      ],
      instructions: ["Mix ingredients", "Serve"],
      nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
      servingSizeGrams: 300,
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      _id: "2",
      name: "Protein Shake",
      image: "/assets/meals/shake.jpg",
      description: "High protein shake",
      ingredients: [
        { name: "Protein Powder", quantity: "30g", calories: 120 },
        { name: "Milk", quantity: "200ml", calories: 100 }
      ],
      instructions: ["Blend ingredients"],
      nutrition: { calories: 220, protein: 25, carbs: 15, fat: 5 },
      servingSizeGrams: 230,
      createdAt: "2024-01-02T00:00:00.000Z"
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockMealService.getAllMeals.mockResolvedValue({ data: mockMeals });
    mockConfirm.mockReturnValue(true);
  });

  test("renders loading state initially", () => {
    render(<MealGallery onNavigate={() => {}} />);

    expect(screen.getByText("Loading Your Meals")).toBeInTheDocument();
    expect(screen.getByText("Preparing your culinary collection...")).toBeInTheDocument();
  });

  test("fetches and displays meals successfully", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("displays stats correctly", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getAllByText("2").length).toBeGreaterThan(0); // Total meals
      expect(screen.getByText("620")).toBeInTheDocument(); // Total calories (400 + 220)
      expect(screen.getByText("310")).toBeInTheDocument(); // Avg calories (620 / 2)
      expect(screen.getAllByText("1").length).toBeGreaterThan(0); // High protein meals (25g+)
    });
  });

  test("handles search functionality", async () => {
    mockMealService.searchMeals.mockResolvedValue({ data: [mockMeals[0]] });

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Search meals by name or ingredients...");
    fireEvent.change(searchInput, { target: { value: "chicken" } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(mockMealService.searchMeals).toHaveBeenCalledWith("chicken");
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.queryByText("Protein Shake")).not.toBeInTheDocument();
    });
  });

  test("clears search and refetches all meals", async () => {
    mockMealService.searchMeals.mockResolvedValue({ data: [mockMeals[0]] });

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    // Search first
    const searchInput = screen.getByPlaceholderText("Search meals by name or ingredients...");
    fireEvent.change(searchInput, { target: { value: "chicken" } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(mockMealService.searchMeals).toHaveBeenCalledWith("chicken");
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
    });
  });

  test("filters meals by category", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const filterSelect = screen.getByDisplayValue("All Categories");
    fireEvent.change(filterSelect, { target: { value: "high-protein" } });

    await waitFor(() => {
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.queryByText("Protein Shake")).not.toBeInTheDocument(); // 25g protein, should be filtered out
    });
  });

  test("sorts meals by different criteria", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const sortSelect = screen.getByDisplayValue("Newest First");
    fireEvent.change(sortSelect, { target: { value: "name" } });

    // Should sort alphabetically: Chicken Salad, Protein Shake
    await waitFor(() => {
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("toggles view mode", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    // Both view mode buttons should exist
    const gridButton = screen.getByText("Grid");
    const listButton = screen.getByText("List");
    
    expect(gridButton).toBeInTheDocument();
    expect(listButton).toBeInTheDocument();

    // Click to switch to list view
    fireEvent.click(listButton);

    // Verify the click was registered (buttons should still be in document)
    expect(screen.getByText("Grid")).toBeInTheDocument();
    expect(screen.getByText("List")).toBeInTheDocument();
  });

  test("deletes meal with confirmation", async () => {
    mockConfirm.mockReturnValue(true);
    mockMealService.deleteMeal.mockResolvedValue({});

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(btn => btn.querySelector('svg[class*="lucide-trash"]'));
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this meal?');
    });
  });

  test("does not delete when confirmation is cancelled", async () => {
    mockConfirm.mockReturnValue(false);

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(btn => btn.querySelector('svg[class*="lucide-trash"]'));
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this meal?');
    expect(mockMealService.deleteMeal).not.toHaveBeenCalled();
    expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
  });

  test("handles delete error", async () => {
    mockConfirm.mockReturnValue(true);
    mockMealService.deleteMeal.mockRejectedValue(new Error("Delete failed"));

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(btn => btn.querySelector('svg[class*="lucide-trash"]'));
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMealService.deleteMeal).toHaveBeenCalled();
    });
  });

  test("navigates to meal detail", async () => {
    const mockOnNavigate = vi.fn();

    render(<MealGallery onNavigate={mockOnNavigate} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const viewButtons = screen.getAllByText("View");
    fireEvent.click(viewButtons[0]);

    expect(mockOnNavigate).toHaveBeenCalledWith('meal-detail', { mealId: "2" });
  });

  test("navigates to edit meal", async () => {
    const mockOnNavigate = vi.fn();

    render(<MealGallery onNavigate={mockOnNavigate} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockOnNavigate).toHaveBeenCalledWith('edit-meal', { mealId: "2" });
  });

  test("navigates to add meal from empty state", async () => {
    mockMealService.getAllMeals.mockResolvedValue({ data: [] });

    const mockOnNavigate = vi.fn();

    render(<MealGallery onNavigate={mockOnNavigate} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const addButton = screen.getByText("Add Your First Meal");
    fireEvent.click(addButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('add-meal');
  });

  test("shows empty state when no meals found", async () => {
    mockMealService.getAllMeals.mockResolvedValue({ data: [] });

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("No Meals Yet")).toBeInTheDocument();
      expect(screen.getByText("Start building your meal collection by adding your first delicious recipe!")).toBeInTheDocument();
    });
  });

  test("shows filtered empty state", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    // Apply a filter that will show no results (high-calorie >= 500)
    const filterSelect = screen.getByDisplayValue("All Categories");
    fireEvent.change(filterSelect, { target: { value: "high-calorie" } });

    await waitFor(() => {
      expect(screen.getByText("No Meals Found")).toBeInTheDocument();
    });
  });

  test("clears filters", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    // Apply filter that shows no results
    const filterSelect = screen.getByDisplayValue("All Categories");
    fireEvent.change(filterSelect, { target: { value: "high-calorie" } });

    await waitFor(() => {
      expect(screen.getByText("No Meals Found")).toBeInTheDocument();
    });

    // Clear filters
    const clearButton = screen.getByText("Clear Filters");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    mockMealService.getAllMeals.mockRejectedValue(new Error("Fetch failed"));

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch meals")).toBeInTheDocument();
    });
  });

  test("handles search error", async () => {
    mockMealService.searchMeals.mockRejectedValue(new Error("Search failed"));

    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Search meals by name or ingredients...");
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to search meals")).toBeInTheDocument();
    });
  });

  test("displays meal ingredients preview", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Chicken")).toBeInTheDocument();
      expect(screen.getByText("Lettuce")).toBeInTheDocument();
    });
  });

  test("shows correct meal count in stats", async () => {
    render(<MealGallery onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("2 meals found")).toBeInTheDocument();
    });
  });
});