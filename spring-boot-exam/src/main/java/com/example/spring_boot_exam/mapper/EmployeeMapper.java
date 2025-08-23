package com.example.spring_boot_exam.mapper;

import org.springframework.stereotype.Component;

import com.example.spring_boot_exam.dto.EmployeeCreateDto;
import com.example.spring_boot_exam.dto.EmployeeResponseDto;
import com.example.spring_boot_exam.dto.EmployeeUpdateDto;
import com.example.spring_boot_exam.entity.Employee;

@Component
public class EmployeeMapper {
    public Employee toEntity(EmployeeCreateDto dto) {
        Employee employee = Employee.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .phoneNumber(dto.getPhoneNumber())
                .active(dto.getActive() != null ? dto.getActive() : false)
                .build();
        return employee;
    }

    public EmployeeResponseDto toResponseDto(Employee employee) {
        return EmployeeResponseDto.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .phoneNumber(employee.getPhoneNumber())
                .active(employee.getActive())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    public void updateEntity(Employee employee, EmployeeUpdateDto dto) {
        if (dto.getFullName() != null) {
            employee.setFullName(dto.getFullName());
        }
        if (dto.getDateOfBirth() != null) {
            employee.setDateOfBirth(dto.getDateOfBirth());
        }
        if (dto.getGender() != null) {
            employee.setGender(dto.getGender());
        }
        if (dto.getPhoneNumber() != null) {
            employee.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getActive() != null) {
            employee.setActive(dto.getActive());
        }
    }
}
