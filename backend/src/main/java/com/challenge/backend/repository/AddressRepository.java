package com.challenge.backend.repository;

import com.challenge.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Modifying
    @Query("UPDATE Address a SET a.isMainAddress = false WHERE a.user.id = :userId")
    void resetMainAddressForUser(@Param("userId") Long userId);

    List<Address> findAllByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long id, Long userId);

    Optional<Address> findFirstByUserIdOrderByIdAsc(Long userId);
}