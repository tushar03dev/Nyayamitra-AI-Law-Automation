package com.example.backend.repo;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // extra query methods if needed, e.g. Optional<User> findByEmail(String email);
}
