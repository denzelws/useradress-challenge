package com.challenge.backend.controller;

import com.challenge.backend.dto.AddressRequestDto;
import com.challenge.backend.dto.AddressResponseDto;
import com.challenge.backend.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponseDto>> getAllAddresses(@PathVariable Long userId) {
        List<AddressResponseDto> response = addressService.getAllAddressesByUser(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AddressResponseDto> createAddress(
            @PathVariable Long userId,
            @RequestBody AddressRequestDto requestDto) {

        AddressResponseDto response = addressService.createAddress(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody AddressRequestDto requestDto) {

        AddressResponseDto response = addressService.updateAddress(userId, addressId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}