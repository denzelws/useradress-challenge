package com.challenge.backend.dto;

import com.challenge.backend.entity.Role;
import com.challenge.backend.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record UserResponseDto(
        Long id,
        String name,
        String cpf,
        LocalDate birthDate,
        Role role,
        List<AddressResponseDto> addresses
) {
    public static UserResponseDto fromEntity(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getCpf(),
                user.getBirthDate(),
                user.getRole(),
                user.getAddresses() != null ?
                        user.getAddresses().stream()
                                .map(AddressResponseDto::fromEntity)
                                .collect(Collectors.toList()) : null
        );
    }
}