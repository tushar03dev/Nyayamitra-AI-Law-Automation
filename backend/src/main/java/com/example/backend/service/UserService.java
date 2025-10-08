package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private UserRepository repo;
    public UserService(UserRepository repo){ this.repo = repo;}

    public List<User> findAll() {
        return repo.findAll();
    }
}
