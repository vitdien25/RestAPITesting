import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";
import { extractErrorMessage } from "../utils/error";
import { employeeService } from "../services/employeeService";
import type {
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from "../types/employee";

export const QUERY_KEYS = {
  EMPLOYEES: ["employees"],
  EMPLOYEE: (id: number) => ["employee", id],
};

// Get all employees
export const useEmployees = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEES,
    queryFn: employeeService.getAllEmployees,
  });
};

// Get employee by ID
export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE(id),
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  });
};

// Create employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeCreateRequest) =>
      employeeService.createEmployee(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
      message.success(response.message);
    },
    onError: (error: AxiosError) => {
      const msg = extractErrorMessage(error);
      message.error(msg || "Failed to create employee");
    },
  });
};

// Update employee
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateRequest }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEE(id) });
      message.success(response.message);
    },
    onError: (error: AxiosError) => {
      const msg = extractErrorMessage(error);
      message.error(msg || "Failed to update employee");
    },
  });
};

// Delete employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeService.deleteEmployee(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
      message.success(response.message);
    },
    onError: (error: AxiosError) => {
      const msg = extractErrorMessage(error);
      message.error(msg || "Failed to delete employee");
    },
  });
};
