# DB presentation

Here I generated a random db of pet owners via faker, with more than 2 millions entries.
The purpose here is to get familiar with indexes and views with a few tests ran throught PGAdmin with direct queries.

# Experimentations on indexes

## The queries used

### Query n°1
```SQL
SELECT * FROM people
WHERE country = 'Corée du Sud';
```
### Query n°2
```SQL
SELECT * FROM people
WHERE dog_breed = 'Shikoku';
```

## 1 - First case : Without index

### Query n°1
10024 results, average time = 251 ms
<details>

|Index|query time (ms)|
|--|--|
|1|268|
|2|294|
|3|272|
|4|243|
|5|288|
|6|132|
|7|252|
|8|253|
|9|261|
|10|248|

</details>

### Query n°2
4097 results, average time = 298 ms
<details>

|Index|query time (ms)|
|--|--|
|1|292|
|2|319|
|3|302|
|4|262|
|5|294|
|6|434|
|7|220|
|8|287|
|9|281|
|10|296|

</details>

## 2 - Second case : multiple unrelated B-Tree indexes

### Indexes creation

```SQL
CREATE INDEX "country_idx" ON "people" ("country");
CREATE INDEX "dog_breed_idx" ON "people" ("dog_breed"); 
```

Tailles respectives des index : 14 et 13 MB

### Query n°1
Average time = 83 ms
<details>

|Index|query time (ms)|
|--|--|
|1|93|
|2|133|
|3|75|
|4|67|
|5|66|
|6|84|
|7|70|
|8|73|
|9|74|
|10|104|

</details>

### Query n°2
Average time = 70 ms
<details>

|Index|query time (ms)|
|--|--|
|1|57|
|2|86|
|3|63|
|4|66|
|5|57|
|6|70|
|7|97|
|8|85|
|9|69|
|10|54|

</details>

## 3 - Third case : unique B-Tree index

### Indexes creation

```SQL
CREATE INDEX "country_idx" ON "people" ("country","dog_breed");
```

Taille de l'index : 18 MB

### Query n°1
Average time = 82 ms
<details>

|Index|query time (ms)|
|--|--|
|1|77|
|2|107|
|3|79|
|4|101|
|5|71|
|6|90|
|7|97|
|8|69|
|9|65|
|10|68|

</details>

### Query n°2
Average time = 82 ms
<details>

|Index|query time (ms)|
|--|--|
|1|65|
|2|61|
|3|57|
|4|64|
|5|72|
|6|107|
|7|75|
|8|173|
|9|83|
|10|70|

</details>

## 4 - Fourth case : unique BRIN index

### Indexes creation

```SQL
CREATE INDEX "country_idx" ON "people" USING brin("country","dog_breed");
```

Taille de l'index : 40 kB

### Query n°1
Average time = 159 ms
<details>

|Index|query time (ms)|
|--|--|
|1|151|
|2|167|
|3|207|
|4|144|
|5|165|
|6|158|
|7|147|
|8|151|
|9|157|
|10|147|

</details>

### Query n°2
Average time = 149 ms
<details>

|Index|query time (ms)|
|--|--|
|1|155|
|2|152|
|3|150|
|4|145|
|5|147|
|6|143|
|7|141|
|8|153|
|9|152|
|10|158|

</details>

## 5 - Fifth case : double BRIN index

### Indexes creation

```SQL
CREATE INDEX "country_idx" ON "people" USING brin("country");
CREATE INDEX "dog_breed_idx" ON "people" USING brin("dog_breed");  
```

Taille des index : 32 et 32 kB

### Query n°1
Average time = 142 ms
<details>

|Index|query time (ms)|
|--|--|
|1|124|
|2|113|
|3|137|
|4|148|
|5|186|
|6|148|
|7|135|
|8|142|
|9|147|
|10|149|

</details>

### Query n°2
Average time = 146 ms
<details>

|Index|query time (ms)|
|--|--|
|1|162|
|2|158|
|3|161|
|4|152|
|5|135|
|6|132|
|7|147|
|8|125|
|9|144|
|10|148|

</details>

## 6 - Sixth case : using views

### Declaring views

View 1 :
```sql
CREATE VIEW people_from_corée_du_sud AS
SELECT * from people WHERE "country"='Corée du Sud';
```

View 1 :
```sql
CREATE VIEW people_have_Shikoku AS
SELECT * from people WHERE "dog_breed"='Shikoku';
```
### Queries

#### Query n°1
```SQL
SELECT * FROM people_from_corée_du_sud;
```
#### Query n°2
```SQL
SELECT * FROM people_have_Shikoku;
```

### Query n°1
Average time = 72 ms
<details>

|Index|query time (ms)|
|--|--|
|1|64|
|2|63|
|3|75|
|4|72|
|5|67|
|6|89|
|7|73|
|8|74|
|9|78|
|10|66|

</details>

### Query n°2
Average time = 65 ms
<details>

|Index|query time (ms)|
|--|--|
|1|62|
|2|73|
|3|48|
|4|66|
|5|72|
|6|58|
|7|71|
|8|68|
|9|75|
|10|54|
