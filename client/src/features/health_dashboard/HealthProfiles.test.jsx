import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HealthProfiles from "./HealthProfiles";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { getUserHealthProfiles } from "../../services/healthService";

// Mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock service
vi.mock("../../services/healthService", () => ({
  getUserHealthProfiles: vi.fn(),
  deleteHealthProfile: vi.fn(),
}));

// tests for HealthProfiles component
describe("HealthProfiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test for loading state
  test("renders loading state", () => {
    getUserHealthProfiles.mockReturnValue(new Promise(() => {}));
    render(<BrowserRouter><HealthProfiles /></BrowserRouter>);
    expect(screen.getByText("Loading profiles...")).toBeInTheDocument();
  });

  // test for empty state
  test("renders empty state", async () => {
    getUserHealthProfiles.mockResolvedValue({
      data: { success: true, data: [] }
    });

    // wrap in BrowserRouter since component uses Link
    render(<BrowserRouter><HealthProfiles /></BrowserRouter>);

    // wait for async data load
    await waitFor(() => {
      expect(screen.getByText("No health profiles found.")).toBeInTheDocument();
    });
  });
});
