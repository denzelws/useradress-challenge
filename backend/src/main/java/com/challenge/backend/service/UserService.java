package com.challenge.backend.service;

import com.challenge.backend.dto.AddressResponseDto;
import com.challenge.backend.dto.UserRequestDto;
import com.challenge.backend.dto.UserResponseDto;
import com.challenge.backend.entity.Role;
import com.challenge.backend.entity.User;
import com.challenge.backend.exception.BusinessException;
import com.challenge.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public UserResponseDto createUser(UserRequestDto requestDto) {
        if (userRepository.existsByCpf(requestDto.cpf())) {
            throw new BusinessException("Não é permitido cadastrar mais de um usuário com o mesmo CPF.");
        }

        User user = User.builder()
                .name(requestDto.name())
                .cpf(requestDto.cpf())
                .birthDate(requestDto.birthDate())
                .password(requestDto.password())
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponseDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getCpf(),
                savedUser.getBirthDate(),
                savedUser.getRole(),
                List.of()
        );
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<AddressResponseDto> addressDtos = user.getAddresses().stream()
                .map(AddressResponseDto::fromEntity)
                .toList();

        return new UserResponseDto(
                user.getId(), user.getName(), user.getCpf(),
                user.getBirthDate(), user.getRole(), addressDtos
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            List<AddressResponseDto> addressDtos = user.getAddresses().stream()
                    .map(AddressResponseDto::fromEntity)
                    .toList();
            return new UserResponseDto(
                    user.getId(), user.getName(), user.getCpf(),
                    user.getBirthDate(), user.getRole(), addressDtos
            );
        }).toList();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }
}