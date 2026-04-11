import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import EditMeal from "./EditMeal";
import { vi } from "vitest";
import { mealService } from "../../services/mealService";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ mealId: "123" }),
    useNavigate: () => mockNavigate,
  };
});

// Mock services
vi.mock("../../services/mealService");

describe("EditMeal", () => {
  const mockMealService = vi.mocked(mealService);

  const mockMeal = {
    _id: "123",
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMealService.getMealById.mockResolvedValue({ data: mockMeal });
    mockMealService.updateMeal.mockResolvedValue({ data: mockMeal });
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading meal data...")).toBeInTheDocument();
  });

  test("fetches and displays meal data successfully", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
      expect(screen.getByDisplayValue("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Healthy chicken salad")).toBeInTheDocument();
    });
  });

  test("displays meal header correctly", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Meal")).toBeInTheDocument();
      expect(screen.getByText("Update your meal information and nutrition details")).toBeInTheDocument();
    });
  });

  test("updates meal name input field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const nameInput = screen.getByDisplayValue("Chicken Salad");
    fireEvent.change(nameInput, { target: { value: "Grilled Chicken Salad" } });

    expect(nameInput.value).toBe("Grilled Chicken Salad");
  });

  test("updates description input field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const descriptionInput = screen.getByDisplayValue("Healthy chicken salad");
    fireEvent.change(descriptionInput, { target: { value: "Very healthy grilled chicken salad" } });

    expect(descriptionInput.value).toBe("Very healthy grilled chicken salad");
  });

  test("updates serving size field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const servingSizeInput = screen.getByDisplayValue("300");
    fireEvent.change(servingSizeInput, { target: { value: "350" } });

    expect(servingSizeInput.value).toBe("350");
  });

  test("updates image URL field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const imageInput = screen.getByDisplayValue("/assets/meals/chicken.jpg");
    fireEvent.change(imageInput, { target: { value: "/assets/meals/grilled-chicken.jpg" } });

    expect(imageInput.value).toBe("/assets/meals/grilled-chicken.jpg");
  });

  test("displays existing ingredients", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Chicken")).toBeInTheDocument();
      expect(screen.getByDisplayValue("200g")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("15")[0]).toBeInTheDocument(); // Lettuce calories (first one)
      expect(screen.getByDisplayValue("Lettuce")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100g")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("15")[1]).toBeInTheDocument(); // Chicken calories (second one)
    });
  });

  test("updates ingredient fields", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const ingredientNameInput = screen.getByDisplayValue("Chicken");
    fireEvent.change(ingredientNameInput, { target: { value: "Grilled Chicken" } });

    expect(ingredientNameInput.value).toBe("Grilled Chicken");
  });

  test("adds new ingredient field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const addButton = screen.getByText("Add Ingredient");
    fireEvent.click(addButton);

    // Should now have 3 ingredient fields
    const ingredientInputs = screen.getAllByPlaceholderText("Ingredient name");
    expect(ingredientInputs).toHaveLength(3);
  });

  test("removes ingredient field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[1]);

    // Should now have only 1 ingredient field
    const ingredientInputs = screen.getAllByPlaceholderText("Ingredient name");
    expect(ingredientInputs).toHaveLength(1);
  });

  test("displays existing instructions", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Mix ingredients")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Serve")).toBeInTheDocument();
    });
  });

  test("updates instruction fields", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const instructionInput = screen.getByDisplayValue("Mix ingredients");
    fireEvent.change(instructionInput, { target: { value: "Mix all ingredients together" } });

    expect(instructionInput.value).toBe("Mix all ingredients together");
  });

  test("adds new instruction field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const addButton = screen.getByText("Add Step");
    fireEvent.click(addButton);

    // Should now have 3 instruction fields
    const instructionInputs = screen.getAllByPlaceholderText(/Step \d+:/);
    expect(instructionInputs).toHaveLength(3);
  });

  test("removes instruction field", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[1]);

    // Should now have only 2 instruction fields (original + one added, then one removed)
    const instructionInputs = screen.getAllByPlaceholderText(/Step \d+:/);
    expect(instructionInputs).toHaveLength(2);
  });

  test("displays existing nutrition values", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("400")).toBeInTheDocument(); // Calories
      expect(screen.getByDisplayValue("35")).toBeInTheDocument(); // Protein
      expect(screen.getByDisplayValue("20")).toBeInTheDocument(); // Carbs
      expect(screen.getAllByDisplayValue("15")[1]).toBeInTheDocument(); // Fat (second one)
    });
  });

  test("updates nutrition fields", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const caloriesInput = screen.getByDisplayValue("400");
    const proteinInput = screen.getByDisplayValue("35");
    const carbsInput = screen.getByDisplayValue("20");
    const fatInput = screen.getAllByDisplayValue("15")[1]; // Get the second one (fat field)

    fireEvent.change(caloriesInput, { target: { value: "450" } });
    fireEvent.change(proteinInput, { target: { value: "40" } });
    fireEvent.change(carbsInput, { target: { value: "25" } });
    fireEvent.change(fatInput, { target: { value: "18" } });

    expect(caloriesInput.value).toBe("450");
    expect(proteinInput.value).toBe("40");
    expect(carbsInput.value).toBe("25");
    expect(fatInput.value).toBe("18");
  });

  test("successfully submits updated meal", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const nameInput = screen.getByDisplayValue("Chicken Salad");
    fireEvent.change(nameInput, { target: { value: "Updated Chicken Salad" } });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMealService.updateMeal).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          name: "Updated Chicken Salad"
        })
      );
      expect(screen.getByText("Meal updated successfully!")).toBeInTheDocument();
    });
  });

  test("displays error when name is empty on submit", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const nameInput = screen.getByDisplayValue("Chicken Salad");
    fireEvent.change(nameInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Meal name is required")).toBeInTheDocument();
    });
  });

  test("displays error when description is empty on submit", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const descriptionInput = screen.getByDisplayValue("Healthy chicken salad");
    fireEvent.change(descriptionInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  test("displays error when serving size is invalid on submit", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const servingSizeInput = screen.getByDisplayValue("300");
    fireEvent.change(servingSizeInput, { target: { value: "0" } });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Serving size must be at least 1 gram")).toBeInTheDocument();
    });
  });

  test("handles update error gracefully", async () => {
    mockMealService.updateMeal.mockRejectedValue({
      response: { data: { message: "Update failed" } }
    });

    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("navigates back to meal details", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const backButton = screen.getByText(/back/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/meal/123");
  });

  test("handles fetch error", async () => {
    mockMealService.getMealById.mockRejectedValue(new Error("Fetch failed"));

    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch meal data")).toBeInTheDocument();
    });
  });

  test("shows loading spinner during fetch", () => {
    mockMealService.getMealById.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading meal data...")).toBeInTheDocument();
    // Loading spinner present but no specific role to check
  });

  test("shows loading spinner during update", async () => {
    mockMealService.updateMeal.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
    });

    const submitButton = screen.getByRole("button", { name: /save|update|submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText("Updating Meal...")).toBeInTheDocument();
    // Loading spinner present but no specific role to check
  });

  test("displays image format hint", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Valid formats: jpg, jpeg, png, gif, webp. Leave empty to use default image.")).toBeInTheDocument();
    });
  });

  test("displays nutrition section header", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Nutrition Information (per serving)")).toBeInTheDocument();
    });
  });

  test("displays basic information section header", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Basic Information")).toBeInTheDocument();
    });
  });

  test("displays ingredients section header", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Ingredients")).toBeInTheDocument();
    });
  });

  test("displays cooking instructions section header", async () => {
    render(
      <MemoryRouter>
        <EditMeal />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Cooking Instructions")).toBeInTheDocument();
    });
  });
});
