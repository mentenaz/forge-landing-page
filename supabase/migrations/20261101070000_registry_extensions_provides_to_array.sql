-- Fixes "operator does not exist: jsonb && unknown" on every provides-
-- filtered registry query (i.e. every Extensions-panel tab except "All").
--
-- .overlaps("provides", [...]) in the API routes generates Postgres's &&
-- array-overlap operator, which only works against a native array column,
-- not jsonb. Converts the existing jsonb array data in place rather than
-- dropping it, since the sync Action has already populated real rows.
--
-- Done as add-column/UPDATE/drop-rename rather than a single
-- ALTER COLUMN ... TYPE ... USING, since Postgres's USING clause flatly
-- disallows subqueries (even ones only reading the row's own column) —
-- "cannot use subquery in transform expression" — while a plain UPDATE's
-- SET clause has no such restriction.
--
-- Run once in the Supabase SQL editor (same as extension_versions.sql —
-- this project has no CLI migration setup).

ALTER TABLE registry_extensions ADD COLUMN provides_arr text[];

UPDATE registry_extensions
SET provides_arr = ARRAY(SELECT jsonb_array_elements_text(provides));

ALTER TABLE registry_extensions ALTER COLUMN provides_arr SET NOT NULL;
ALTER TABLE registry_extensions ALTER COLUMN provides_arr SET DEFAULT '{}'::text[];

ALTER TABLE registry_extensions DROP COLUMN provides;
ALTER TABLE registry_extensions RENAME COLUMN provides_arr TO provides;
