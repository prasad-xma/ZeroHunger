import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateProfile from "./CreateProfile";
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

// Mock service
vi.mock("../../services/healthService", () => ({
  createHealthProfile: vi.fn(),
}));

describe("CreateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders step 1 of profile creation", () => {
    render(<BrowserRouter><CreateProfile /></BrowserRouter>);
    expect(screen.getByText("Create Health Profile")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("My Health Profile")).toBeInTheDocument();
  });
});
