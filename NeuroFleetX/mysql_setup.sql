-- MySQL Setup Script for NeuroFleetX
-- Run this as MySQL root user

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS neurofleetx;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'neuro_user'@'localhost' IDENTIFIED BY 'neuro123';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON neurofleetx.* TO 'neuro_user'@'localhost';

-- Apply the privilege changes
FLUSH PRIVILEGES;

-- Verify the grants
SHOW GRANTS FOR 'neuro_user'@'localhost';
