import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import LoginPage from "./Login";
import { vi } from "vitest";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock login
const mockLogin = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test case 1
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <LoginPage onSwitchToRegister={() => { }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  test("updates input fields", () => {
    render(
      <MemoryRouter>
        <LoginPage onSwitchToRegister={() => { }} />
      </MemoryRouter>
    );

    const email = screen.getByPlaceholderText("Enter your email");
    const password = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(email, { target: { value: "test@mail.com" } });
    fireEvent.change(password, { target: { value: "123456" } });

    expect(email.value).toBe("test@mail.com");
    expect(password.value).toBe("123456");
  });

  test("toggles password visibility", () => {
    render(
      <MemoryRouter>
        <LoginPage onSwitchToRegister={() => { }} />
      </MemoryRouter>
    );

    const password = screen.getByPlaceholderText("Enter your password");

    const toggleBtn = screen.getAllByRole("button")[0];
    // first button = eye toggle

    fireEvent.click(toggleBtn);
    expect(password.type).toBe("text");

    fireEvent.click(toggleBtn);
    expect(password.type).toBe("password");
  });

  test("successful login redirects", async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <LoginPage onSwitchToRegister={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@mail.com", "123456");
      expect(mockNavigate).toHaveBeenCalledWith("/landing");
    });
  });

  test("failed login shows error", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });

    render(
      <MemoryRouter>
        <LoginPage onSwitchToRegister={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
