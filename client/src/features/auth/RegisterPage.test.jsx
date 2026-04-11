import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import RegisterPage from "./Register";
import { vi } from "vitest";
import { register as mockRegister } from "../../services/authService";

// Mock register service
vi.mock("../../services/authService", () => ({
  register: vi.fn(),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders registration form", () => {
    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={() => { }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1 000 000 0000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min. 6 chars")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Re-enter password")).toBeInTheDocument();
  });

  test("updates input fields", () => {
    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={() => { }} />
      </MemoryRouter>
    );

    const firstName = screen.getByPlaceholderText("First name");
    const lastName = screen.getByPlaceholderText("Last name");
    const email = screen.getByPlaceholderText("your@email.com");

    fireEvent.change(firstName, { target: { value: "John" } });
    fireEvent.change(lastName, { target: { value: "Doe" } });
    fireEvent.change(email, { target: { value: "john@mail.com" } });

    expect(firstName.value).toBe("John");
    expect(lastName.value).toBe("Doe");
    expect(email.value).toBe("john@mail.com");
  });

  test("shows validation error when fields are empty", async () => {
    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={() => { }} />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });
  });

  test("shows validation error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("+1 000 000 0000"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Min. 6 chars"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Re-enter password"), { target: { value: "different123" } });

    const submitBtn = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  test("successful registration", async () => {
    mockRegister.mockResolvedValue({ data: { message: "User registered successfully" } });
    const mockSwitchToLogin = vi.fn();

    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={mockSwitchToLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("+1 000 000 0000"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Min. 6 chars"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Re-enter password"), { target: { value: "password123" } });

    const submitBtn = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@mail.com",
        phoneNumber: "1234567890",
        gender: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        },
        password: "password123",
        confirmPassword: "password123"
      });
      expect(screen.getByText("User registered successfully")).toBeInTheDocument();
    });
  });

  test("failed registration shows error from api", async () => {
    mockRegister.mockRejectedValue({
      response: { data: { message: "Email already exists" } }
    });

    render(
      <MemoryRouter>
        <RegisterPage onSwitchToLogin={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("+1 000 000 0000"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Min. 6 chars"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Re-enter password"), { target: { value: "password123" } });

    const submitBtn = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });
});
