const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const API_URL = process.env.API_URL;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// fetch wrapper (dinamikus import)
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Állomás keresés
app.post("/api/searchStation", async (req, res) => {
  const { query } = req.body;

  const payload = {
    func: "getStationOrAddrByText",
    params: {
      inputText: query,
      searchIn: ["stations"],
      searchDate: new Date().toISOString().split("T")[0], // mai dátum
      maxResults: 30,
      networks: [1, 2, 3, 10, 11, 12, 13, 14, 24, 25, 26],
      currentMode: "position_based",
      currentLang: "hu",
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Járatok keresése
app.post("/api/searchRoutes", async (req, res) => {
  const { from, to } = req.body;

  const payload = {
    func: "getRoutes",
    params: {
      networks: [1, 2, 3, 10, 11, 12, 13, 14, 24, 25, 26],
      datum: new Date().toISOString().split("T")[0],
      erk_stype: "megallo",
      ext_settings: "block",
      filtering: 0,
      helyi: "No",

      // indulási pont
      honnan: from.name,
      honnan_ls_id: from.ls_id ?? 0, // <<<< FONTOS
      honnan_settlement_id: from.settlementId,
      honnan_site_code: from.siteCode ?? 0,

      hour: new Date().getHours().toString(),

      // érkezési pont
      hova: to.name,
      hova_ls_id: to.ls_id ?? 0, // <<<< FONTOS
      hova_settlement_id: to.settlementId,
      hova_site_code: to.siteCode ?? 0,

      ind_stype: "megallo",
      keresztul_stype: "megallo",
      maxatszallas: "5",
      maxvar: "240",
      maxwalk: "1000",
      min: new Date().getMinutes().toString(),
      napszak: 3,
      naptipus: 0,
      odavissza: 0,
      preferencia: "0",
      rendezes: "1",
      submitted: 1,
      talalatok: 1,
      target: 0,
      utirany: "oda",
      var: "0",
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Felhasználó által beállított idő szerinti keresés
app.post("/api/searchRoutesCustom", async (req, res) => {
  const { from, to, date, hour, minute } = req.body;

  const payload = {
    func: "getRoutes",
    params: {
      networks: [1, 2, 3, 10, 11, 12, 13, 14, 24, 25, 26],
      datum: date,                       // <<< DÁTUM
      ind_stype: "megallo",
      erk_stype: "megallo",

      honnan: from.name,
      honnan_ls_id: from.ls_id ?? 0,
      honnan_settlement_id: from.settlementId,
      honnan_site_code: from.siteCode ?? 0,

      hova: to.name,
      hova_ls_id: to.ls_id ?? 0,
      hova_settlement_id: to.settlementId,
      hova_site_code: to.siteCode ?? 0,

      hour: hour.toString(),             // <<< ÓRA (stringben kell!)
      min: minute.toString(),            // <<< PERC

      ext_settings: "block",
      filtering: 0,
      helyi: "No",
      keresztul_stype: "megallo",
      maxatszallas: "5",
      maxvar: "240",
      maxwalk: "1000",
      napszak: 3,
      naptipus: 0,
      odavissza: 0,
      preferencia: "0",
      rendezes: "1",
      submitted: 1,
      talalatok: 1,
      target: 0,
      utirany: "oda",
      var: "0"
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Járat leírás
app.post("/api/runDescription", async (req, res) => {
  try {
    // Full compatibility: accept both camelCase and snake_case
    const {
      runId, run_id,
      slsId, sls_id,
      elsId, els_id,
      date
    } = req.body;

    const runIdFinal = runId ?? run_id;
    const slsIdFinal = slsId ?? sls_id;
    const elsIdFinal = elsId ?? els_id;

    // Validate parameters
    if (!runIdFinal || !slsIdFinal || !elsIdFinal || !date) {
      return res.status(400).json({
        error: "Missing or invalid parameters",
        received: req.body
      });
    }

    const payload = {
      query: "runDecriptionC",
      run_id: runIdFinal,
      domain_type: 1,
      sls_id: slsIdFinal,
      els_id: elsIdFinal,
      location: "hk",
      datum: date,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Return ONLY kifejtes_sor, fallback {}, frontend expects object
    return res.json(data?.results?.kifejtes_sor || {});
  }

  catch (err) {
    console.error("runDescription API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Bejelentkezés
app.post("/api/login", async (req, res) => {
  const { felhasznalonev, jelszo } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM felhasznalo WHERE felhasznalonev = ? AND jelszo = ?",
      [felhasznalonev, jelszo]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Hibás felhasználónév vagy jelszó" });
    }
    res.json({ message: "Sikeres bejelentkezés", user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tervek listázása bejelentkezett felhasználónak
app.get("/api/plans/:felhasznalonev", async (req, res) => {
  const { felhasznalonev } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM tervek WHERE felhasznalonev = ?", [felhasznalonev]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Egy tervhez tartozó járatok részletesen
app.get("/api/planRoutes/:tervId", async (req, res) => {
  const { tervId } = req.params;
  console.log(" ^=^q^i /api/planRoutes called with tervId =", tervId);
  try {
    const [rows] = await db.query(
      `SELECT j.id, j.ind_allomas, j.erk_allomas, j.ind_ido, j.erk_ido,
              j.jegyar, j.jarmu_id, j.ido, j.km, tj.sorrend
       FROM terv_jarat tj
       JOIN jarat j ON tj.jarat_id = j.id
       WHERE tj.terv_id = ?
       ORDER BY tj.sorrend ASC`,
      [tervId]
    );
    console.log(" ^|^e SQL returned rows:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error(" ^}^l SQL error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
