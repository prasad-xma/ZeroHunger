import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResultsPage from "./Results";
import { vi } from "vitest";
import { getUserAllergyProfile } from "../../services/aiFoodAllergyService";
import { BrowserRouter } from "react-router-dom";

// Mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

// Mock service
vi.mock("../../services/aiFoodAllergyService", () => ({
  getUserAllergyProfile: vi.fn(),
  deleteAllergyProfile: vi.fn(),
}));

describe("ResultsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    getUserAllergyProfile.mockReturnValue(new Promise(() => {}));
    render(<BrowserRouter><ResultsPage /></BrowserRouter>);
    expect(screen.getByText("Loading your allergy profile...")).toBeInTheDocument();
  });

  test("shows error if api fails", async () => {
    getUserAllergyProfile.mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    render(<BrowserRouter><ResultsPage /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  test("shows no profile found", async () => {
    getUserAllergyProfile.mockResolvedValue({
      data: { success: true, data: null }
    });

    render(<BrowserRouter><ResultsPage /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("No Allergy Profile Found")).toBeInTheDocument();
    });
  });

  test("displays profile data successfully", async () => {
    getUserAllergyProfile.mockResolvedValue({
      data: {
        success: true,
        data: {
          allergies: ["Peanuts"],
          ai_response: {
            foods_to_avoid: ["Peanut Butter"],
            recommendations: ["Stay safe"],
          }
        }
      }
    });

    render(<BrowserRouter><ResultsPage /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("Your Allergy Profile")).toBeInTheDocument();
      expect(screen.getByText("Peanuts")).toBeInTheDocument();
      expect(screen.getByText("Peanut Butter")).toBeInTheDocument();
    });
  });
});
