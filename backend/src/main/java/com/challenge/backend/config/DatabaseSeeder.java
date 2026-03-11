package com.challenge.backend.config;

import com.challenge.backend.entity.Role;
import com.challenge.backend.entity.User;
import com.challenge.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args -> {
            if (repository.findByCpf("00000000000").isEmpty()) {
                User admin = User.builder()
                        .name("Admin Solution")
                        .cpf("00000000000")
                        .password("admin123")
                        .birthDate(LocalDate.of(2000, 1, 1))
                        .role(Role.ADMIN)
                        .build();

                repository.save(admin);
                System.out.println("✅ Admin Solution criado com sucesso!");
            }
        };
    }
}
