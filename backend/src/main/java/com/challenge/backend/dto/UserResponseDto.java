package com.challenge.backend.dto;

import com.challenge.backend.entity.Role;

import java.time.LocalDate;
import java.util.List;

public record UserResponseDto(
        Long id,
        String name,
        String cpf,
        LocalDate birthDate,
        Role role,
        List<AddressResponseDto> addresses
) {
}
