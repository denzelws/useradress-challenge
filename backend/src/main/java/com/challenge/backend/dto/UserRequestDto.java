package com.challenge.backend.dto;

import java.time.LocalDate;

public record UserRequestDto(
        String name,
        String cpf,
        LocalDate birthDate,
        String password
) {
}
