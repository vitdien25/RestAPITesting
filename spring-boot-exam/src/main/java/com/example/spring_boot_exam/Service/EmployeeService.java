package com.example.spring_boot_exam.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.spring_boot_exam.dto.EmployeeCreateDto;
import com.example.spring_boot_exam.dto.EmployeeResponseDto;
import com.example.spring_boot_exam.dto.EmployeeUpdateDto;
import com.example.spring_boot_exam.entity.Employee;
import com.example.spring_boot_exam.exception.DuplicateResourceException;
import com.example.spring_boot_exam.exception.ResourceNotFoundException;
import com.example.spring_boot_exam.mapper.EmployeeMapper;
import com.example.spring_boot_exam.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmployeeMapper employeeMapper;

    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeCreateDto createDto) {
        if (employeeRepository.existsByEmail(createDto.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        Employee employee = employeeMapper.toEntity(createDto);

        String hashedPassword = passwordEncoder.encode(createDto.getPassword());
        employee.setHashedPassword(hashedPassword);

        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDto(savedEmployee);
    }

    public List<EmployeeResponseDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(employeeMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return employeeMapper.toResponseDto(employee);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, EmployeeUpdateDto updateDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employeeMapper.updateEntity(employee, updateDto);

        Employee updatedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDto(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employeeRepository.delete(employee);
    }
}
