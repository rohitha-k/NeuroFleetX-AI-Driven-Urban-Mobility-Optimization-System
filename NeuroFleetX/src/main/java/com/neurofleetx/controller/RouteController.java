package com.neurofleetx.controller;

import com.neurofleetx.service.RouteService;
import com.neurofleetx.service.RouteService.RouteOption; // Using inner class for now or move to DTO
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeRoute(@RequestBody RouteRequest request) {
        RouteOptimizationResponse response = new RouteOptimizationResponse();

        // Default to "Standard" if null
        String vType = request.getVehicleType() != null ? request.getVehicleType() : "Standard";

        List<RouteOption> routes = routeService.optimizeRoutes(request.getOrigin(), request.getDestination(), vType);

        response.setRoutes(routes);
        response.setStatus("success");
        return ResponseEntity.ok(response);
    }

    // Request DTO
    public static class RouteRequest {
        private String origin;
        private String destination;
        private String vehicleType;

        public String getOrigin() {
            return origin;
        }

        public void setOrigin(String origin) {
            this.origin = origin;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
        }
    }

    // Response DTO
    public static class RouteOptimizationResponse {
        private List<RouteOption> routes;
        private String status;

        public List<RouteOption> getRoutes() {
            return routes;
        }

        public void setRoutes(List<RouteOption> routes) {
            this.routes = routes;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}