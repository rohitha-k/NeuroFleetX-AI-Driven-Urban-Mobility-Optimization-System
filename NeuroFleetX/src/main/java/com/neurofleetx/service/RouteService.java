package com.neurofleetx.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RouteService {

    public List<RouteOption> optimizeRoutes(String origin, String destination, String vehicleType) {
        // Deterministically generate slightly different paths for each option
        List<RouteOption> routes = new ArrayList<>();
        double speedMultiplier = "EV".equalsIgnoreCase(vehicleType) ? 0.95 : 1.0; // EVs might drive more conservatively

        routes.add(generateRoute(origin, destination, "fastest", 1.0, speedMultiplier));
        routes.add(generateRoute(origin, destination, "shortest", 0.9, speedMultiplier));
        routes.add(generateRoute(origin, destination, "eco-friendly", 1.1, speedMultiplier));
        return routes;
    }

    private RouteOption generateRoute(String origin, String destination, String type, double curveFactor,
            double speedMultiplier) {
        RouteOption route = new RouteOption();
        route.setType(type);

        double[] start = getCoordinates(origin);
        double[] end = getCoordinates(destination);

        List<Coordinate> coordinates = generateRealisticPath(start, end, curveFactor);
        route.setCoordinates(coordinates);

        double distance = calculateDistance(coordinates);
        double baseSpeed = 60.0 * speedMultiplier;

        if ("fastest".equals(type)) {
            baseSpeed = 75.0 * speedMultiplier;
            route.setTrafficLevel("Light");
            route.setDistance(String.format("%.1f km", distance));
        } else if ("shortest".equals(type)) {
            baseSpeed = 50.0 * speedMultiplier;
            route.setTrafficLevel("Moderate");
            route.setDistance(String.format("%.1f km", distance * 0.95));
        } else {
            baseSpeed = 65.0 * speedMultiplier;
            route.setTrafficLevel("Efficient");
            route.setDistance(String.format("%.1f km", distance * 1.02));
        }

        double timeInMinutes = (distance / baseSpeed) * 60;
        route.setEstimatedTime(formatTime(timeInMinutes));

        return route;
    }

    private double[] getCoordinates(String input) {
        Map<String, double[]> cityCoords = new HashMap<>();
        cityCoords.put("bangalore", new double[] { 12.9716, 77.5946 });
        cityCoords.put("bengaluru", new double[] { 12.9716, 77.5946 });
        cityCoords.put("mg road", new double[] { 12.9750, 77.6010 }); // More accurate
        cityCoords.put("indiranagar", new double[] { 12.9783, 77.6408 });
        cityCoords.put("indira nagar", new double[] { 12.9783, 77.6408 });
        cityCoords.put("koramangala", new double[] { 12.9352, 77.6245 });
        cityCoords.put("whitefield", new double[] { 12.9698, 77.7500 });
        cityCoords.put("hsr layout", new double[] { 12.9121, 77.6446 });
        cityCoords.put("electronic city", new double[] { 12.8399, 77.6770 });
        cityCoords.put("mysore", new double[] { 12.2958, 76.6394 });
        cityCoords.put("hyderabad", new double[] { 17.3850, 78.4867 });
        cityCoords.put("secunderabad", new double[] { 17.4399, 78.4983 });
        cityCoords.put("chennai", new double[] { 13.0827, 80.2707 });
        cityCoords.put("vijayawada", new double[] { 16.5062, 80.6480 });
        cityCoords.put("visakhapatnam", new double[] { 17.6868, 83.2185 });
        cityCoords.put("vizag", new double[] { 17.6868, 83.2185 });
        cityCoords.put("tirupati", new double[] { 13.6288, 79.4192 });
        cityCoords.put("coimbatore", new double[] { 11.0168, 76.9558 });
        cityCoords.put("kochi", new double[] { 9.9312, 76.2673 });
        cityCoords.put("mumbai", new double[] { 19.0760, 72.8777 });
        cityCoords.put("pune", new double[] { 18.5204, 73.8567 });

        // Normalize input: remove ", India", ", Karnataka", etc.
        String cleanInput = input.toLowerCase().split(",")[0].trim();

        if (cityCoords.containsKey(cleanInput)) {
            return cityCoords.get(cleanInput);
        }

        // Partial match check
        for (String key : cityCoords.keySet()) {
            if (cleanInput.contains(key) || key.contains(cleanInput)) {
                return cityCoords.get(key);
            }
        }

        // Fallback: Generate consistent random coordinates based on city name hash
        // Bounded to South India approximately (Lat: 8-20, Lng: 74-85)
        long hash = cleanInput.hashCode();
        Random rng = new Random(hash);
        double lat = 8.0 + rng.nextDouble() * 12.0;
        double lng = 74.0 + rng.nextDouble() * 11.0;
        return new double[] { lat, lng };
    }

    private List<Coordinate> generateRealisticPath(double[] start, double[] end, double curveFactor) {
        List<Coordinate> path = new ArrayList<>();
        path.add(new Coordinate(start[0], start[1]));

        double dist = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
        int segments = Math.max(10, (int) (dist * 10)); // More segments for longer distances

        // Generate control points for a Bezier-like curve or randomized deviation
        for (int i = 1; i < segments; i++) {
            double ratio = (double) i / segments;

            // Linear point
            double lat = start[0] + (end[0] - start[0]) * ratio;
            double lng = start[1] + (end[1] - start[1]) * ratio;

            // Add sinusoidal deviation to create "zigzag" or curve
            // The deviation is max at the center of the path
            double deviation = Math.sin(ratio * Math.PI) * (dist * 0.2) * curveFactor;

            // Perpendicular jitter (simple approximation)
            if (i % 2 == 0) {
                lat += deviation * 0.1;
                lng -= deviation * 0.1;
            } else {
                lat -= deviation * 0.1;
                lng += deviation * 0.1;
            }

            // Small random road noise
            lat += (Math.random() - 0.5) * 0.01;
            lng += (Math.random() - 0.5) * 0.01;

            path.add(new Coordinate(lat, lng));
        }

        path.add(new Coordinate(end[0], end[1]));
        return path;
    }

    private double calculateDistance(List<Coordinate> coordinates) {
        if (coordinates.size() < 2)
            return 0;
        double total = 0;
        for (int i = 0; i < coordinates.size() - 1; i++) {
            Coordinate c1 = coordinates.get(i);
            Coordinate c2 = coordinates.get(i + 1);
            // Haversine approximation
            double R = 6371; // Earth radius in km
            double dLat = Math.toRadians(c2.getLat() - c1.getLat());
            double dLon = Math.toRadians(c2.getLng() - c1.getLng());
            double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(Math.toRadians(c1.getLat())) * Math.cos(Math.toRadians(c2.getLat())) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            total += R * c;
        }
        return total;
    }

    private String formatTime(double minutes) {
        int hours = (int) (minutes / 60);
        int mins = (int) (minutes % 60);
        return hours > 0 ? String.format("%dh %dm", hours, mins) : String.format("%dm", mins);
    }

    public static class RouteOption {
        private String type;
        private String distance;
        private String estimatedTime;
        private String trafficLevel;
        private List<Coordinate> coordinates;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDistance() {
            return distance;
        }

        public void setDistance(String distance) {
            this.distance = distance;
        }

        public String getEstimatedTime() {
            return estimatedTime;
        }

        public void setEstimatedTime(String estimatedTime) {
            this.estimatedTime = estimatedTime;
        }

        public String getTrafficLevel() {
            return trafficLevel;
        }

        public void setTrafficLevel(String trafficLevel) {
            this.trafficLevel = trafficLevel;
        }

        public List<Coordinate> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<Coordinate> coordinates) {
            this.coordinates = coordinates;
        }
    }

    public static class Coordinate {
        private Double lat;
        private Double lng;

        public Coordinate(Double lat, Double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public Double getLat() {
            return lat;
        }

        public Double getLng() {
            return lng;
        }
    }
}
