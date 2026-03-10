package com.challenge.backend.controller;

import com.challenge.backend.dto.AddressResponseDto;
import com.challenge.backend.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class GlobalAddressController {

    private final AddressService addressService;

    public GlobalAddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponseDto>> getAllAddressesGlobally() {
        return ResponseEntity.ok(addressService.getAllAddressesGlobally());
    }
}