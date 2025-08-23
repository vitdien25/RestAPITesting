package com.example.spring_boot_exam.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_exam.Service.EmployeeService;
import com.example.spring_boot_exam.dto.ApiResponse;
import com.example.spring_boot_exam.dto.EmployeeCreateDto;
import com.example.spring_boot_exam.dto.EmployeeResponseDto;
import com.example.spring_boot_exam.dto.EmployeeUpdateDto;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
// @CrossOrigin(origins = "https://rest-api-testing-seven.vercel.app/")
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> createEmployee(
            @Validated @RequestBody EmployeeCreateDto createDto) {
        EmployeeResponseDto employeeResponseDto = employeeService.createEmployee(createDto);
        ApiResponse<EmployeeResponseDto> apiResponse = ApiResponse.success("Create Employee successful",
                employeeResponseDto);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponseDto>>> getAllEmployee() {
        List<EmployeeResponseDto> employeeResponseDtos = employeeService.getAllEmployees();
        ApiResponse<List<EmployeeResponseDto>> apiResponse = ApiResponse.success("Get All Employees successful",
                employeeResponseDtos);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDto employeeResponseDto = employeeService.getEmployeeById(id);
        ApiResponse<EmployeeResponseDto> apiResponse = ApiResponse.success("Get Employee successful",
                employeeResponseDto);
        return ResponseEntity.ok(apiResponse);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> updateEmployee(@PathVariable Long id,
            @Validated @RequestBody EmployeeUpdateDto updateDto) {
        EmployeeResponseDto employeeResponseDto = employeeService.updateEmployee(id, updateDto);
        ApiResponse<EmployeeResponseDto> apiResponse = ApiResponse.success("Update Employee successful",
                employeeResponseDto);
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        ApiResponse<Void> apiResponse = ApiResponse.success("Delete Employee successful", null);
        return ResponseEntity.ok(apiResponse);
    }

}
