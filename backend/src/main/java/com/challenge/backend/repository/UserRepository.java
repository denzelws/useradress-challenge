package com.challenge.backend.repository;

import com.challenge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByCpf(String cpf);

    Optional<User> findByCpf(String cpf);
}