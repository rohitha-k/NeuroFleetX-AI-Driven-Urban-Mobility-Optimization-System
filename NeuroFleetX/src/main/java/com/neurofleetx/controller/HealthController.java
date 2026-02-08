package com.neurofleetx.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "NeuroFleetX backend is running successfully!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}