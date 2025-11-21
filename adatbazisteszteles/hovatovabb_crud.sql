-- Adatbázis kiválasztása
USE hovatovabb_test;

--
-- 10+1 DB CREATE (INSERT INTO)
--

-- 1. Diákkedvezmény beszúrása
INSERT INTO kedvezmenyek (id, nev, szazalek)
VALUES (1, 'Diák', 50);

-- 2. Nyugdíj kedvezmény beszúrása
INSERT INTO kedvezmenyek (id, nev, szazalek)
VALUES (2, 'Nyugdíjas', 100);

-- 3. Felhasználó felvétele
INSERT INTO felhasznalo (felhasznalonev, jelszo, teljes_nev, email, kedv_id)
VALUES ('benjike', 'tesztelek', 'Stonawski Benjamin', 'stonawski@benjamin.com', 1);

-- 4. Felhasználó felvétele
INSERT INTO felhasznalo (felhasznalonev, jelszo, teljes_nev, email, kedv_id)
VALUES ('deaklevi', 'tesztelek', 'Deák Levente', 'deak@levente.com', 2);

-- 5. Jármű felvétele - busz
INSERT INTO jarmu (id, tipus)
VALUES (1, 'busz');

-- 6. Jármű felvétele - vonat
INSERT INTO jarmu (id, tipus)
VALUES (2, 'vonat');

-- 7. Járat felvétele – Mátészalka-Nyíregyháza
INSERT INTO jarat (id, ind_allomas, erk_allomas, ind_ido, erk_ido, jegyar, jarmu_id)
VALUES (1, 'Mátészalka', 'Nyíregyháza', '2025-11-05 07:30', '2025-11-05 09:00', 1800, 1);

-- 8. Járat felvétele – Budapest-Nyugati
INSERT INTO jarat (id, ind_allomas, erk_allomas, ind_ido, erk_ido, jegyar, jarmu_id)
VALUES (2, 'Nyíregyháza', 'Budapest-Nyugati', '2025-11-05 09:45', '2025-11-05 13:00', 5200, 2);

-- 9. Terv hozzáadása
INSERT INTO tervek (id, felhasznalonev)
VALUES (1, 'benjike');

-- 10. Terv–járat kapcsolás 1. lépés
INSERT INTO terv_jarat (terv_id, jarat_id, sorrend)
VALUES (1, 1, 1);

-- 11. Terv–járat kapcsolás 2. lépés
INSERT INTO terv_jarat (terv_id, jarat_id, sorrend)
VALUES (1, 2, 2);

--
-- 10 DB READ (SELECT, WHERE, ORDER BY, GROUP BY, JOIN)
--

-- 1. Összes felhasználó kilistázása
SELECT * FROM felhasznalo;

-- 2. Csak a diák kedvezményes felhasználók kilistázása
SELECT * FROM felhasznalo
WHERE kedv_id = 1;

-- 3. Járatok kilistázása idő szerint rendezve
SELECT * FROM jarat
ORDER BY ind_ido ASC;

-- 4. Járműtípusok listázása ABC szerint
SELECT * FROM jarmu
ORDER BY tipus ASC;

-- 5. Járatok, melyek több mint 3000 Ft-ba kerülnek
SELECT * FROM jarat
WHERE jegyar > 3000;

-- 6. Felhasználók a kedvezmény nevével
SELECT f.teljes_nev, k.nev AS kedvezmeny
FROM felhasznalo f
JOIN kedvezmenyek k ON f.kedv_id = k.id;

-- 7. Terv járatai sorrendben
SELECT t.id AS terv_id, j.ind_allomas, j.erk_allomas, tj.sorrend
FROM terv_jarat tj
JOIN jarat j ON tj.jarat_id = j.id
JOIN tervek t ON tj.terv_id = t.id
WHERE t.id = 1
ORDER BY tj.sorrend;

-- 8. Járatok + jármű típusa
SELECT j.ind_allomas, j.erk_allomas, ja.tipus
FROM jarat j
JOIN jarmu ja ON j.jarmu_id = ja.id;

-- 9. Felhasználó + terv száma
SELECT f.teljes_nev, COUNT(t.id) AS terv_db
FROM felhasznalo f
JOIN tervek t ON f.felhasznalonev = t.felhasznalonev
GROUP BY f.teljes_nev;

-- 10. Csak buszos járatok a tervekből
SELECT j.ind_allomas, j.erk_allomas
FROM terv_jarat tj
JOIN jarat j ON tj.jarat_id = j.id
JOIN jarmu ja ON j.jarmu_id = ja.id
WHERE ja.tipus = 'busz';

--
-- 5 DB UPDATE
--

-- 1. Felhasználó e-mail címének frissítése
UPDATE felhasznalo
SET email = 'ujemail@example.com'
WHERE felhasznalonev = 'benjike';

-- 2. Járat jegyárának módosítása
UPDATE jarat
SET jegyar = jegyar + 500
WHERE ind_allomas = 'Mátészalka' AND erk_allomas = 'Nyíregyháza';

-- 3. Tervhez tartozó sorrend frissítése
UPDATE terv_jarat
SET sorrend = 1
WHERE terv_id = 1 AND jarat_id = 2;

-- 4. Kedvezmény mértékének módosítása
UPDATE kedvezmenyek
SET szazalek = 40
WHERE nev = 'Diák';

-- 5. Jármű típusának módosítása
UPDATE jarmu
SET tipus = 'expressz busz'
WHERE id = 1;


--
-- 5 DB DELETE
--

-- 1. Terv–járat törlése (id=1)
DELETE FROM terv_jarat WHERE terv_id = 1;

-- 2. Terv törlése (id=1)
DELETE FROM tervek WHERE id = 1;

-- 3. Járat törlése (id=1)
DELETE FROM jarat WHERE id = 1;

-- 4. Járat törlése (id=2)
DELETE FROM jarat WHERE id = 2;

-- 5. Jármű törlése (expressz busz)
DELETE FROM jarmu WHERE id = 1;