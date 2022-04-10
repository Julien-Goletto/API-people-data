BEGIN;

# Test 1 : multiple indexes for one table
CREATE UNIQUE INDEX "country_idx" ON "people" ("country");
CREATE UNIQUE INDEX "dog_breed_idx" ON "people" ("dog_breed"); 

COMMIT;