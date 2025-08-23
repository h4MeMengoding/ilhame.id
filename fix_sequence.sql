-- Fix auto-increment sequence for projects table
-- Run this if you get "Unique constraint failed on the fields: (`id`)" error

-- Reset the auto-increment sequence to the next available ID
SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM projects;

-- Check current sequence value
SELECT currval(pg_get_serial_sequence('projects', 'id'));

-- Check max ID in table
SELECT MAX(id) FROM projects;

-- Alternative fix if above doesn't work:
-- ALTER SEQUENCE projects_id_seq RESTART WITH [next_id];
-- Replace [next_id] with MAX(id) + 1 from the projects table
