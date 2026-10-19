import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Login from "../src/components/Login";
import Signup from "../src/components/Signup";

describe("Login Component", () => {
  test("이메일과 비밀번호 입력 필드를 렌더링한다", () => {
    // Arrange
    render(<Login onLogin={vi.fn()} />);
    // Act (없음)

    // Assert
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });
  test("폼 제출 시 onLogin 콜백을 호출한다", () => {
    // Arrange
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);
    // Act
    fireEvent.click(screen.getByLabelText("이메일"), {
      target: { value: "new@test.com" },
    });
    fireEvent.click(screen.getByLabelText("비밀번호"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    // Assert
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: "new@test.com",
      password: "password123",
    });
  });
});

describe("Signup Component", () => {
  test("이메일, 비밀번호, 비밀번호 확인 입력 필드를 렌더링한다", () => {
    render(<Signup onSignup={vi.fn()} />);

    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "회원가입" })).toBeInTheDocument();
  });
  test("폼 제출 시 onSignup 콜백을 호출한다", () => {
    const mockOnSignup = vi.fn();
    render(<Signup onSignup={mockOnSignup} />);

    fireEvent.click(screen.getByLabelText("이메일"), { target: { value: "new@test.com" } });
    fireEvent.click(screen.getByLabelText("비밀번호"), { target: { value: "password123" } });
    fireEvent.click(screen.getByLabelText("비밀번호 확인"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(mockOnSignup).toHaveBeenCalledWith({ email: "new@test.com", password: "password123" });
  });
  test("비밀번호 확인이 다르면 에러를 보여주고 콜백을 호출하지 않는다", () => {
    const mockOnSignup = vi.fn();
    render(<Signup onSignup={mockOnSignup} />);

    fireEvent.click(screen.getByLabelText("이메일"), { target: { value: "new@test.com" } });
    fireEvent.click(screen.getByLabelText("비밀번호"), { target: { value: "password123" } });
    fireEvent.click(screen.getByLabelText("비밀번호 확인"), { target: { value: "different123" } });
    fireEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(screen.getByRole("alert")).toHaveTextContent("비밀번호가 일치하지 않습니다.");
    expect(mockOnSignup).not.toHaveBeenCalled();
  });
});
