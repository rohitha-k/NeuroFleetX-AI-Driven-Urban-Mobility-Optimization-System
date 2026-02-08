package com.neurofleetx.config;

import com.neurofleetx.model.Role;
import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin
            if (!userRepository.existsByEmail("admin@neurofleetx.com")) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@neurofleetx.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Seeded admin user: admin@neurofleetx.com");
            }

            // Seed Manager
            if (!userRepository.existsByEmail("manager@neurofleetx.com")) {
                User manager = new User();
                manager.setName("Manager User");
                manager.setEmail("manager@neurofleetx.com");
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setRole(Role.MANAGER);
                userRepository.save(manager);
                System.out.println("Seeded manager user: manager@neurofleetx.com");
            }

            // Seed Driver
            if (!userRepository.existsByEmail("driver1@neurofleetx.com")) {
                User driver = new User();
                driver.setName("John Driver");
                driver.setEmail("driver1@neurofleetx.com");
                driver.setPassword(passwordEncoder.encode("driver123"));
                driver.setRole(Role.DRIVER);
                userRepository.save(driver);
                System.out.println("Seeded driver user: driver1@neurofleetx.com");
            }

            // Seed Customer (Matching the screenshot)
            if (!userRepository.existsByEmail("cust1@neurofleetx.com")) {
                User customer = new User();
                customer.setName("Jane Customer");
                customer.setEmail("cust1@neurofleetx.com");
                customer.setPassword(passwordEncoder.encode("password"));
                customer.setRole(Role.CUSTOMER);
                userRepository.save(customer);
                System.out.println("Seeded customer user: cust1@neurofleetx.com");
            }
        };
    }
}
