import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import TaskTable, { type Task } from "../src/components/TaskTable";

describe("TaskTable Component", () => {
  const mockTasks: Task[] = [
    { id: 1, title: "태스크 1", status: "pending", description: "설명 1" },
    { id: 2, title: "태스크 2", status: "completed", description: "설명 2" },
  ];
  test("태스크 목록을 테이블로 렌더링한다", () => {
    // Arrange
    render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDelete={vi.fn()} />);
    // Act (없음)

    // Assert
    expect(screen.getByLabelText("태스크 1")).toBeInTheDocument();
    expect(screen.getByLabelText("태스크 2")).toBeInTheDocument();
    expect(screen.getByLabelText("pending")).toBeInTheDocument();
    expect(screen.getByLabelText("completed")).toBeInTheDocument();
  });
  test("상태 변경 클릭 시 onStatusChange 콜백을 호출한다", () => {
    const mockOnStatusChange = vi.fn();
    // Arrange
    render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDelete={vi.fn()} />);
    // Act
    const statusButton = screen.getAllByRole("button", { name: "상태 변경" })[0];
    fireEvent.click(statusButton);
    // Assert
    expect(mockOnStatusChange).toHaveBeenCalledWith(1, "completed");
  });
  test("완료된 태스크의 상태 변경 클릭 시 pending으로 되돌린다", () => {
    const mockOnStatusChange = vi.fn();
    // Arrange
    render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDelete={vi.fn()} />);
    // Act
    fireEvent.click(screen.getAllByRole("button", { name: "상태 변경" })[1]);
    // Assert
    expect(mockOnStatusChange).toHaveBeenCalledWith(2, "pending");
  });
  test("태스크가 없으면 빈 상태 메시지를 보여준다", () => {
    render(<TaskTable tasks={[]} onStatusChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("태스크가 없습니다.")).toBeInTheDocument();
  });
  test("삭제 버튼 클릭 시 onDelete 콜백을 호출한다", () => {
    const mockOnDelete = vi.fn();
    // Arrange
    render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDelete={mockOnDelete} />);
    // Act
    const deleteButton = screen.getAllByRole("button", { name: "삭제" })[0];
    fireEvent.click(deleteButton);
    // Assert
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
});
