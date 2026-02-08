package com.neurofleetx.dto;

import java.util.Map;

public class DashboardResponseDto {
    private String message;
    private Map<String, Object> stats;

    public DashboardResponseDto(String message, Map<String, Object> stats) {
        this.message = message;
        this.stats = stats;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getStats() {
        return stats;
    }

    public void setStats(Map<String, Object> stats) {
        this.stats = stats;
    }
}
