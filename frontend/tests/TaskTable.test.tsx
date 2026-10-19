import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import TaskTable, { type Task } from "../src/components/TaskTable";

describe("TaskTable Component", () => {
  const mockTasks: Task[] = [
    { id: 1, title: "태스크 1", status: "pending", description: "설명 1" },
    { id: 2, title: "태스크 2", status: "completed", description: "설명 2" },
  ];
  test("태스크 목록을 테이블로 렌더링한다", () => {
    render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("태스크 1")).toBeInTheDocument();
    expect(screen.getByText("태스크 2")).toBeInTheDocument();
    expect(screen.getByTestId("status-pending")).toHaveTextContent("대기중");
    expect(screen.getByTestId("status-completed")).toHaveTextContent("완료");
  });
  test("상태 배지를 눌러 선택한 상태로 onStatusChange 콜백을 호출한다", () => {
    const mockOnStatusChange = vi.fn();
    render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByTestId("status-pending"));
    fireEvent.click(screen.getByRole("menuitem", { name: "진행중" }));

    expect(mockOnStatusChange).toHaveBeenCalledWith(1, "in_progress");
  });
  test("현재와 같은 상태를 선택하면 콜백을 호출하지 않는다", () => {
    const mockOnStatusChange = vi.fn();
    render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByTestId("status-pending"));
    fireEvent.click(screen.getByRole("menuitem", { name: "대기중" }));

    expect(mockOnStatusChange).not.toHaveBeenCalled();
  });
  test("완료된 태스크를 대기중으로 되돌릴 수 있다", () => {
    const mockOnStatusChange = vi.fn();
    render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByTestId("status-completed"));
    fireEvent.click(screen.getByRole("menuitem", { name: "대기중" }));

    expect(mockOnStatusChange).toHaveBeenCalledWith(2, "pending");
  });
  test("삭제 버튼 클릭 시 onDelete 콜백을 호출한다", () => {
    const mockOnDelete = vi.fn();
    render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getAllByRole("button", { name: "삭제" })[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
  test("태스크가 없으면 빈 상태 메시지를 보여준다", () => {
    render(<TaskTable tasks={[]} onStatusChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("태스크가 없습니다.")).toBeInTheDocument();
  });
});
