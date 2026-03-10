package com.challenge.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String street;

    private String number;

    private String city;

    private String state;

    private String zipCode;

    private Boolean mainAddress = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}