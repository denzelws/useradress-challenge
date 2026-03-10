package com.challenge.backend.dto;

import com.challenge.backend.entity.Address;

public record AddressResponseDto(
        Long id,
        String zipCode,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        Boolean isMainAddress,
        Long userId
) {
    public static AddressResponseDto fromEntity(Address address) {
        return new AddressResponseDto(
                address.getId(),
                address.getZipCode(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getIsMainAddress(),
                address.getUser().getId()
        );
    }
}