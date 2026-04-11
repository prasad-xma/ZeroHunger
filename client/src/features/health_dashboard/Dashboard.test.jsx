import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { getUserHealthProfiles, getAllHealthAdvice } from "../../services/healthService";
import { getUserAllergyProfile } from "../../services/aiFoodAllergyService";

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
vi.mock("../../services/healthService", () => ({
  getUserHealthProfiles: vi.fn(),
  getAllHealthAdvice: vi.fn(),
}));

// Mock AI food allergy service
vi.mock("../../services/aiFoodAllergyService", () => ({
  getUserAllergyProfile: vi.fn(),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Tests for Dashboard component
describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test for loading state
  test("renders loading state", () => {
    getUserHealthProfiles.mockReturnValue(new Promise(() => {}));
    getAllHealthAdvice.mockReturnValue(new Promise(() => {}));
    getUserAllergyProfile.mockReturnValue(new Promise(() => {}));
    
    render(<BrowserRouter><Dashboard /></BrowserRouter>);
    expect(screen.getByText("Loading your health dashboard...")).toBeInTheDocument();
  });

  // tests for error states, empty states, and successful data rendering would go here
  test("renders empty state", async () => {
    getUserHealthProfiles.mockResolvedValue({ data: { success: true, data: [] } });
    getAllHealthAdvice.mockResolvedValue({ data: { success: true, data: [] } });
    getUserAllergyProfile.mockResolvedValue({ data: { success: true, data: null } });

    render(<BrowserRouter><Dashboard /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("No Health Profiles Yet")).toBeInTheDocument();
    });
  });
});
