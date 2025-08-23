package com.example.spring_boot_exam.dto;

import java.time.LocalDate;

import com.example.spring_boot_exam.entity.Employee.Gender;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateDto {
    @Size(min = 4, max = 160, message = "Full name must be between 4 and 160 characters")
    private String fullName;
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    private Gender gender;
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    private Boolean active;
}
