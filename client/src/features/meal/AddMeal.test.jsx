import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import AddMeal from "./AddMeal";
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

describe("AddMeal", () => {
  const mockMealService = vi.mocked(mealService);

  const mockNewMeal = {
    _id: "123",
    name: "Test Meal",
    image: "/assets/meals/test.jpg",
    description: "Test description",
    ingredients: [
      { name: "Test Ingredient", quantity: "100g", calories: 100 }
    ],
    instructions: ["Test instruction"],
    nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 },
    servingSizeGrams: 300,
    createdAt: "2024-01-01T00:00:00.000Z"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMealService.createMeal.mockResolvedValue({ data: mockNewMeal });
  });

  test("renders AddMeal form correctly", () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    expect(screen.getByText("Creative Meal Studio")).toBeInTheDocument();
    expect(screen.getByText("Design extraordinary meals with intelligent assistance")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., Grilled Chicken Salad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Describe your meal in detail, including taste, texture, and cooking method...")).toBeInTheDocument();
  });

  test("updates meal name input field", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("e.g., Grilled Chicken Salad");
    fireEvent.change(nameInput, { target: { value: "Test Meal" } });

    expect(nameInput.value).toBe("Test Meal");
  });

  test("updates description input field", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    const descriptionInput = screen.getByPlaceholderText("Describe your meal in detail, including taste, texture, and cooking method...");
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });

    expect(descriptionInput.value).toBe("Test description");
  });

  test("fills basic form fields", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    // Fill in required fields for step 1
    const nameInput = screen.getByPlaceholderText("e.g., Grilled Chicken Salad");
    const descriptionInput = screen.getByPlaceholderText("Describe your meal in detail, including taste, texture, and cooking method...");
    const servingSizeInput = screen.getByPlaceholderText("250");
    const imageInput = screen.getByPlaceholderText("/assets/meals/meal-image.jpg");

    fireEvent.change(nameInput, { target: { value: "Test Meal" } });
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    fireEvent.change(servingSizeInput, { target: { value: "300" } });
    fireEvent.change(imageInput, { target: { value: "/assets/meals/test.jpg" } });

    // Verify field values
    expect(nameInput.value).toBe("Test Meal");
    expect(descriptionInput.value).toBe("Test description");
    expect(servingSizeInput.value).toBe("300");
    expect(imageInput.value).toBe("/assets/meals/test.jpg");
  });

  test("navigates to next step", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    // Fill required fields for step 1
    const nameInput = screen.getByPlaceholderText("e.g., Grilled Chicken Salad");
    const descriptionInput = screen.getByPlaceholderText("Describe your meal in detail, including taste, texture, and cooking method...");
    const servingSizeInput = screen.getByPlaceholderText("250");

    fireEvent.change(nameInput, { target: { value: "Test Meal" } });
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    fireEvent.change(servingSizeInput, { target: { value: "300" } });

    // Navigate to next step
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Should be on step 2 now - check progress bar changed from 25% to 50%
    await waitFor(() => {
      const progressBar = document.querySelector('[style*="width: 50%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  test("updates image URL field", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    const imageInput = screen.getByPlaceholderText("/assets/meals/meal-image.jpg");
    fireEvent.change(imageInput, { target: { value: "/assets/meals/test.jpg" } });

    expect(imageInput.value).toBe("/assets/meals/test.jpg");
  });

  test("shows previous button is disabled on first step", async () => {
    render(
      <MemoryRouter>
        <AddMeal />
      </MemoryRouter>
    );

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });
});
