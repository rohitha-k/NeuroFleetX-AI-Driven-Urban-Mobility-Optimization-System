-- Fix Database Schema
-- Run this script to drop existing tables with incorrect schema

USE neurofleetx;

-- Drop tables in correct order (foreign keys first)
DROP TABLE IF EXISTS verification_request;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;

-- Verify tables are dropped
SHOW TABLES;
