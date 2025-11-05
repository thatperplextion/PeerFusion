-- Simple MySQL migration to add profile fields
-- Run this if columns don't exist

ALTER TABLE users 
ADD COLUMN bio TEXT,
ADD COLUMN institution VARCHAR(255),
ADD COLUMN field_of_study VARCHAR(255),
ADD COLUMN avatar VARCHAR(500);
