package com.challenge.backend.dto;

public record AddressRequestDto(
        String zipCode,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        Boolean isMainAddress
) {
}