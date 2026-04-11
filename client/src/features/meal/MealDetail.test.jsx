import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import MealDetail from "./MealDetail";
import { vi } from "vitest";
import { mealService } from "../../services/mealService";
import { addMealToShopping } from "../../services/shoppingService";

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
vi.mock("../../services/shoppingService");

// Mock window.confirm
const mockConfirm = vi.fn();
global.confirm = mockConfirm;

describe("MealDetail", () => {
  const mockMealService = vi.mocked(mealService);
  const mockAddMealToShopping = vi.mocked(addMealToShopping);

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
    mockMealService.deleteMeal.mockResolvedValue({});
    mockAddMealToShopping.mockResolvedValue({ success: true });
    mockConfirm.mockReturnValue(true);
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <MealDetail />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading Meal Details")).toBeInTheDocument();
    expect(screen.getByText("Preparing your culinary experience...")).toBeInTheDocument();
  });

  test("fetches and displays meal successfully", async () => {
    render(
      <MemoryRouter>
        <MealDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockMealService.getMealById).toHaveBeenCalledWith("123");
      expect(screen.getByText("Chicken Salad")).toBeInTheDocument();
      expect(screen.getByText("Healthy chicken salad")).toBeInTheDocument();
    });
  });
});