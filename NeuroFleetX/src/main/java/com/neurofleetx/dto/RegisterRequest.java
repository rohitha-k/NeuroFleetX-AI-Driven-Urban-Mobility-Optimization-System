package com.neurofleetx.dto;

import com.neurofleetx.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}