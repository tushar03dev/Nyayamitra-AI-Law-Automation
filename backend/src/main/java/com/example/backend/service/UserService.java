package com.example.backend.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository repo;
    public UserService(UserRepository repo){ this.repo = repo;}
}
