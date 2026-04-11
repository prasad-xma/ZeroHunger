import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComprehensiveQuestionnaire from "./ComprehensiveQuestionnaire";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock services
vi.mock("../../services/aiFoodAllergyService", () => ({
  generateAllergyRecommendations: vi.fn(),
}));

vi.mock("../../services/healthService", () => ({
  createHealthProfile: vi.fn(),
  generateHealthAdvice: vi.fn(),
}));

describe("ComprehensiveQuestionnaire", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders step 1 of the questionnaire", () => {
    render(<BrowserRouter><ComprehensiveQuestionnaire /></BrowserRouter>);
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });
});
