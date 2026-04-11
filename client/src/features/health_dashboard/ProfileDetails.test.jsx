import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileDetails from "./ProfileDetails";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { getHealthProfileById, getHealthAdvice } from "../../services/healthService";
import { getUserAllergyProfile } from "../../services/aiFoodAllergyService";

// mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ profileId: "123" }),
  };
});

// mock services
vi.mock("../../services/healthService", () => ({
  getHealthProfileById: vi.fn(),
  getHealthAdvice: vi.fn(),
  generateHealthAdvice: vi.fn(),
  updateHealthProfile: vi.fn(),
  deleteHealthProfile: vi.fn(),
  recalculateHealthMetrics: vi.fn(),
}));

// mock AI service
vi.mock("../../services/aiFoodAllergyService", () => ({
  getUserAllergyProfile: vi.fn(),
}));

// Mock ResizeObserver(charts)
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
describe("ProfileDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test case 1
  test("renders loading state", () => {
    getHealthProfileById.mockReturnValue(new Promise(() => {}));
    getHealthAdvice.mockReturnValue(new Promise(() => {}));
    getUserAllergyProfile.mockReturnValue(new Promise(() => {}));
    
    render(<BrowserRouter><ProfileDetails /></BrowserRouter>);
    expect(screen.getByText("Loading profile details...")).toBeInTheDocument();
  });

  // test case 2 - success state
  test("renders error state", async () => {
    getHealthProfileById.mockRejectedValue({
      response: { data: { message: "Server died" } }
    });

    render(<BrowserRouter><ProfileDetails /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("Server died")).toBeInTheDocument();
    });
  });
});
