package com.challenge.backend.service;

import com.challenge.backend.dto.AddressRequestDto;
import com.challenge.backend.dto.AddressResponseDto;
import com.challenge.backend.entity.Address;
import com.challenge.backend.entity.User;
import com.challenge.backend.exception.BusinessException;
import com.challenge.backend.repository.AddressRepository;
import com.challenge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressResponseDto> getAllAddressesGlobally() {
        return addressRepository.findAll().stream()
                .map(AddressResponseDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AddressResponseDto> getAllAddressesByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        return addressRepository.findAllByUserId(userId).stream()
                .map(AddressResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public AddressResponseDto createAddress(Long userId, AddressRequestDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado."));

        boolean willBeMain = dto.isMainAddress() != null ? dto.isMainAddress() : false;

        if (user.getAddresses() == null || user.getAddresses().isEmpty()) {
            willBeMain = true;
        }

        if (willBeMain) {
            addressRepository.resetMainAddressForUser(userId);
        }

        Address address = new Address();
        address.setZipCode(dto.zipCode());
        address.setStreet(dto.street());
        address.setNumber(dto.number());
        address.setComplement(dto.complement());
        address.setNeighborhood(dto.neighborhood());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setIsMainAddress(willBeMain);
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);

        return AddressResponseDto.fromEntity(savedAddress);
    }

    @Transactional
    public AddressResponseDto updateAddress(Long userId, Long addressId, AddressRequestDto dto) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new BusinessException("Endereço não encontrado ou não pertence a este usuário."));

        boolean willBeMain = dto.isMainAddress() != null ? dto.isMainAddress() : false;

        if (willBeMain && !address.getIsMainAddress()) {
            addressRepository.resetMainAddressForUser(userId);
        }

        copyDtoToEntity(dto, address);

        if (address.getIsMainAddress() && !willBeMain) {
            willBeMain = true;
        }

        address.setIsMainAddress(willBeMain);
        Address updatedAddress = addressRepository.save(address);

        return AddressResponseDto.fromEntity(updatedAddress);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new BusinessException("Endereço não encontrado ou não pertence a este usuário."));

        boolean wasMain = address.getIsMainAddress();

        addressRepository.delete(address);

        addressRepository.flush();

        if (wasMain) {
            addressRepository.findFirstByUserIdOrderByIdAsc(userId)
                    .ifPresent(fallbackAddress -> {
                        fallbackAddress.setIsMainAddress(true);
                        addressRepository.save(fallbackAddress);
                    });
        }
    }

    private void copyDtoToEntity(AddressRequestDto dto, Address address) {
        address.setZipCode(dto.zipCode());
        address.setStreet(dto.street());
        address.setNumber(dto.number());
        address.setComplement(dto.complement());
        address.setNeighborhood(dto.neighborhood());
        address.setCity(dto.city());
        address.setState(dto.state());
    }
}