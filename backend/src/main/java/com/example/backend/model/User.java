package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="users", schema = "myschema")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    private String name;

    @Column
    private String picture;

}


