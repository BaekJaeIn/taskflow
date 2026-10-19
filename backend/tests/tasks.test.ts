import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app";

describe("POST /api/tasks", () => {
  let authToken: string;

  beforeAll(async () => {
    // 먼저 사용자 등록 및 로그인하여 토큰을 얻습니다.
    const registerRes = await app.request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "create-task@test.com",
        password: "password123",
      }),
    });
    expect(registerRes.status).toBe(201);
    const registerData = await registerRes.json();
    authToken = registerData.token;
  });

  test("인증된 사용자가 새 태스크를 생성한다", async () => {
    const res = await app.request("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: "새 태스크",
        description: "태스크 설명",
      }),
    });
    expect(res.status).toBe(201);
    const task = await res.json();
    expect(task.title).toBe("새 태스크");
    expect(task.status).toBe("pending");
  });

  test("인증된 사용자가 자신의 태스크 목록을 조회한다", async () => {
    const res = await app.request("/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toBeInstanceOf(Array);
  });
});

describe("PATCH /api/tasks/:id", () => {
  let authToken: string;
  let taskId: string;

  beforeAll(async () => {
    // 사용자 등록 및 로그인
    const registerRes = await app.request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "update-task@test.com",
        password: "password123",
      }),
    });
    expect(registerRes.status).toBe(201);
    const registerData = await registerRes.json();
    authToken = registerData.token;

    // 태스크 생성
    const createTaskRes = await app.request("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: "새 태스크",
        description: "태스크 설명",
      }),
    });
    expect(createTaskRes.status).toBe(201);
    const taskData = await createTaskRes.json();
    taskId = taskData.id;
  });

  test("인증된 사용자가 자신의 태스크 상태를 업데이트한다", async () => {
    const res = await app.request(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        status: "completed",
      }),
    });
    expect(res.status).toBe(200);
    const updateTask = await res.json();
    expect(updateTask.status).toBe("completed");
  });
});

describe("PATCH /api/tasks/:id 상태 값", () => {
  let authToken: string;
  let taskId: string;
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  });

  beforeAll(async () => {
    const registerRes = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "status-task@test.com", password: "password123" }),
    });
    authToken = (await registerRes.json()).token;
    const createRes = await app.request("/api/tasks", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ title: "상태 태스크" }),
    });
    taskId = (await createRes.json()).id;
  });

  test("in_progress 상태로 변경할 수 있다", async () => {
    const res = await app.request(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status: "in_progress" }),
    });
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe("in_progress");
  });

  test("허용되지 않은 상태 값은 400을 반환한다", async () => {
    const res = await app.request(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status: "unknown" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/tasks/:id", () => {
  let authToken: string;
  let taskId: string;

  beforeAll(async () => {
    // 사용자 등록 및 로그인
    const registerRes = await app.request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "delete-task@test.com",
        password: "password123",
      }),
    });
    expect(registerRes.status).toBe(201);
    const registerData = await registerRes.json();
    authToken = registerData.token;

    // 태스크 생성
    const createTaskRes = await app.request("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: "새 태스크",
        description: "태스크 설명",
      }),
    });
    expect(createTaskRes.status).toBe(201);
    const taskData = await createTaskRes.json();
    taskId = taskData.id;
  });

  test("인증된 사용자가 자신의 태스크를 삭제한다", async () => {
    const res = await app.request(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.status).toBe(204);
  });
});
