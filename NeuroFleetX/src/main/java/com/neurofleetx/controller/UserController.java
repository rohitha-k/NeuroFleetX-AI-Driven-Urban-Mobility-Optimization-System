package com.neurofleetx.controller;

import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<?> getAllUsers() {
        return ((List<User>) userRepository.findAll())
                .stream()
                .map(user -> {
                    return java.util.Map.of(
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole());
                })
                .collect(Collectors.toList());
    }
}
