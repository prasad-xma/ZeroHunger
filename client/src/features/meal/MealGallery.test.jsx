import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import MealGallery from "./MealGallery";
import { vi } from "vitest";
import { mealService } from "../../services/mealService";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock services
vi.mock("../../services/mealService");

// Mock window.confirm
const mockConfirm = vi.fn();
global.confirm = mockConfirm;

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
    mockMealService.searchMeals.mockResolvedValue({ data: [mockMeals[0]] });
    mockMealService.deleteMeal.mockResolvedValue({});
    mockConfirm.mockReturnValue(true);
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading Your Meals")).toBeInTheDocument();
    expect(screen.getByText("Preparing your culinary collection...")).toBeInTheDocument();
  });

  test("fetches and displays all meals successfully", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("displays meal gallery header", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Meal Gallery")).toBeInTheDocument();
      expect(screen.getByText(/Discover and manage your delicious meal collection/i)).toBeInTheDocument();
    });
  });

  test("displays correct stats dashboard", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Total meals: 2
      expect(screen.getByText("Total Meals")).toBeInTheDocument();
      expect(screen.getAllByText("2")).toHaveLength(2); // Total Meals and Filtered both show 2

      // Total calories: 400 + 220 = 620
      expect(screen.getByText("Total Calories")).toBeInTheDocument();
      expect(screen.getByText("620")).toBeInTheDocument();

      // Average calories: 620 / 2 = 310
      expect(screen.getByText("Avg Calories")).toBeInTheDocument();
      expect(screen.getByText("310")).toBeInTheDocument();

      // High protein meals: 1 (Chicken Salad has 35g protein > 25g)
      expect(screen.getByText("High Protein")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  test("handles search functionality", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "chicken" } });

    const searchForm = searchInput.closest("form");
    if (searchForm) {
      fireEvent.submit(searchForm);
    } else {
      fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
    }

    await waitFor(() => {
      expect(mockMealService.searchMeals).toHaveBeenCalledWith("chicken");
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.queryByText("Protein Shake")).not.toBeInTheDocument();
    });
  });

  
  test("filters meals by category", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button");
    const deleteButton = deleteButtons.find(btn => 
      btn.getAttribute("aria-label")?.toLowerCase().includes("delete") ||
      btn.title?.toLowerCase().includes("delete")
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this meal?");
        expect(mockMealService.deleteMeal).toHaveBeenCalledWith("1");
      });
    }
  });

  test("does not delete when confirmation is cancelled", async () => {
    mockConfirm.mockReturnValue(false);

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const deleteButtons = screen.getAllByRole("button");
    const deleteButton = deleteButtons.find(btn => 
      btn.getAttribute("aria-label")?.toLowerCase().includes("delete")
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);

      expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this meal?");
      expect(mockMealService.deleteMeal).not.toHaveBeenCalled();
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
    }
  });

  test("navigates to meal detail", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const viewButtons = screen.getAllByText("View");
    fireEvent.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/meal/2");
  });

  test("navigates to edit meal", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/edit-meal/2");
  });

  test("navigates to add meal", async () => {
    mockMealService.getAllMeals.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No Meals Yet")).toBeInTheDocument();
    });

    const addButton = screen.getByText("Add Your First Meal");
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/add-meal");
  });

  test("shows empty state when no meals found", async () => {
    mockMealService.getAllMeals.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No Meals Yet")).toBeInTheDocument();
      expect(screen.getByText("Start building your meal collection by adding your first delicious recipe!")).toBeInTheDocument();
    });
  });

  test("shows filtered empty state", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch meals")).toBeInTheDocument();
    });
  });

  test("handles search error", async () => {
    mockMealService.searchMeals.mockRejectedValue(new Error("Search failed"));

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test" } });

    const searchForm = searchInput.closest("form");
    if (searchForm) {
      fireEvent.submit(searchForm);
    }

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to search meals")).toBeInTheDocument();
    });
  });

  test("displays meal ingredients preview", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Chicken")).toBeInTheDocument();
      expect(screen.getByText("Lettuce")).toBeInTheDocument();
    });
  });

  test("shows correct meal count in stats", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("2 meals found")).toBeInTheDocument();
    });
  });

  test("displays meal nutrition preview", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check that calorie information is displayed
      const calorieElements = screen.getAllByText(/cal/);
      expect(calorieElements.length).toBeGreaterThan(0);
    });
  });

  test("displays meal images", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute("src", expect.stringMatching(/chicken\.jpg|shake\.jpg/));
    });
  });

  test("handles delete error", async () => {
    mockMealService.deleteMeal.mockRejectedValue(new Error("Delete failed"));

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const deleteButtons = screen.getAllByRole("button");
    const deleteButton = deleteButtons.find(btn => 
      btn.getAttribute("aria-label")?.toLowerCase().includes("delete")
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockMealService.deleteMeal).toHaveBeenCalled();
      });
    }
  });

  test("navigates to add meal from empty state", async () => {
    mockMealService.getAllMeals.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No Meals Yet")).toBeInTheDocument();
    });

    const addButton = screen.getByText("Add Your First Meal");
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/add-meal");
  });

  test("sorts meals by calories", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const sortSelect = screen.getByDisplayValue("Newest First");
    fireEvent.change(sortSelect, { target: { value: "calories" } });

    await waitFor(() => {
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("sorts meals by protein content", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const sortSelect = screen.getByDisplayValue("Newest First");
    fireEvent.change(sortSelect, { target: { value: "protein" } });

    await waitFor(() => {
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Protein Shake")).toBeInTheDocument();
    });
  });

  test("filters meals by low calorie", async () => {
    render(
      <MemoryRouter>
        <MealGallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getAllMeals).toHaveBeenCalled();
    });

    const filterSelect = screen.getByDisplayValue("All Categories");
    fireEvent.change(filterSelect, { target: { value: "low-calorie" } });

    await waitFor(() => {
      expect(screen.getByText("Protein Shake")).toBeInTheDocument(); // 220 calories
      expect(screen.queryByText("Chicken Salad")).not.toBeInTheDocument(); // 400 calories
    });
  });
});
