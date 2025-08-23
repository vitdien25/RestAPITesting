import axios from "axios";
import type {
  ApiResponse,
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from "../types/employee";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeService = {
  // GET /api/employees
  getAllEmployees: async (): Promise<ApiResponse<Employee[]>> => {
    const response = await api.get("/employees");
    return response.data;
  },

  // GET /api/employees/:id
  getEmployeeById: async (id: number): Promise<ApiResponse<Employee>> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // POST /api/employees
  createEmployee: async (
    data: EmployeeCreateRequest
  ): Promise<ApiResponse<Employee>> => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  // PATCH /api/employees/:id
  updateEmployee: async (
    id: number,
    data: EmployeeUpdateRequest
  ): Promise<ApiResponse<Employee>> => {
    const response = await api.patch(`/employees/${id}`, data);
    return response.data;
  },

  // DELETE /api/employees/:id
  deleteEmployee: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};
