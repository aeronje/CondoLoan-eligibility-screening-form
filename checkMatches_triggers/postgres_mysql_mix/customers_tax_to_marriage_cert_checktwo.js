// Ron Penones | July 14th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const { Client } = require('pg');
const mysql = require('mysql2/promise');

// Global reusable clients
let pgClient = null;
let mysqlConn = null;

// Function to reconnect safely every cycle
async function connectClients() {
  if (pgClient) await pgClient.end().catch(() => {});
  if (mysqlConn) await mysqlConn.end().catch(() => {});

  pgClient = new Client({
    host: '192.168.137.97',
    database: 'housing',
    user: 'donnahp',
    password: 'password',
    port: 5432,
  });

  mysqlConn = await mysql.createConnection({
    host: '192.168.137.97',
    database: 'psa',
    user: 'donnahp',
    password: 'password',
  });

  await pgClient.connect();
}

async function checkmarriagetwoMatches() {

  const { rows: principalRows } = await pgClient.query(
    `SELECT meg_id, meg_bir_tin_principal FROM megaplanet.customers_tax`
  );

  const positives = [];

  for (const { meg_id, meg_bir_tin_principal } of principalRows) {
    const [psaMatch] = await mysqlConn.execute(
      `SELECT mar_date FROM marriage_cert_check WHERE mar_cedula_tin_husband = ? OR mar_cedula_tin_wife = ? LIMIT 1`,
      [meg_bir_tin_principal, meg_bir_tin_principal]
    );

    if (psaMatch.length > 0) {
      console.log(`${meg_bir_tin_principal} was found in PSA records`);
      positives.push({ meg_id, meg_bir_tin_principal, mar_date: psaMatch[0].mar_date });
    } else {
      console.log(`${meg_bir_tin_principal} was not found in PSA records`);
    }
  }

  for (const pos of positives) {
    const { rows } = await pgClient.query(
      `SELECT meg_id, meg_bir_tin_married FROM megaplanet.customers_tax WHERE meg_bir_tin_principal = $1`,
      [pos.meg_bir_tin_principal]
    );
    rows.forEach(r => {
      console.log(`meg_id ${r.meg_id} with meg_bir_tin_married ${r.meg_bir_tin_married} will require cross matching with PSA records`);
      pos.meg_bir_tin_married = r.meg_bir_tin_married;
    });
  }

  for (const pos of positives) {
    const [marriageRows] = await mysqlConn.execute(
      `SELECT mar_cedula_tin_husband, mar_cedula_tin_wife FROM marriage_cert_check WHERE mar_date = ?`,
      [pos.mar_date]
    );
    pos.psaCouples = marriageRows;
    console.log(`Capturing all positive findings of couples tax numbers using the marriage date condition from the PSA records`);
  }

  const finalPositives = [];
  const finalNegatives = [];

  for (const pos of positives) {
    const { meg_id, meg_bir_tin_principal, meg_bir_tin_married, psaCouples } = pos;
    let match = false;
    psaCouples.forEach(({ mar_cedula_tin_husband, mar_cedula_tin_wife }) => {
      const psaTINs = [mar_cedula_tin_husband, mar_cedula_tin_wife];
      if (psaTINs.includes(meg_bir_tin_principal) && psaTINs.includes(meg_bir_tin_married)) {
        match = true;
      }
    });

    if (match) {
      console.log(`MEG_ID ${meg_id}: Principal TIN ${meg_bir_tin_principal}, Married TIN ${meg_bir_tin_married} validated as POSITIVE match.`);
      finalPositives.push(meg_id);
    } else {
      console.log(`MEG_ID ${meg_id}: Principal TIN ${meg_bir_tin_principal}, Married TIN ${meg_bir_tin_married} FAILED validation.`);
      finalNegatives.push({ meg_id, meg_bir_tin_principal, psaCouples });
    }
  }

  if (finalPositives.length > 0) {
    console.log(`POSITIVE MEG_IDs: ${finalPositives.join(', ')} confirmed valid against PSA.`);
  }

  for (const neg of finalNegatives) {
    const { meg_id, meg_bir_tin_principal, psaCouples } = neg;
    let correctTIN = null;
    for (const { mar_cedula_tin_husband, mar_cedula_tin_wife } of psaCouples) {
      if (mar_cedula_tin_husband === meg_bir_tin_principal) correctTIN = mar_cedula_tin_wife;
      else if (mar_cedula_tin_wife === meg_bir_tin_principal) correctTIN = mar_cedula_tin_husband;
    }

    if (correctTIN && correctTIN !== meg_bir_tin_principal) {
      await pgClient.query(
        `UPDATE megaplanet.customers_tax SET meg_bir_tin_married = $1 WHERE meg_id = $2`,
        [correctTIN, meg_id]
      );
      console.log(`Updated meg_bir_tin_married for MEG_ID ${meg_id} to correct spouse TIN ${correctTIN}`);
    } else {
      console.log(`Skipped update for MEG_ID ${meg_id} — no valid spouse TIN found or matched.`);
    }
  }
}

async function main() {
  try {
    await connectClients();
    await checkmarriagetwoMatches();
  } catch (err) {
    console.error("🚽 skibidi toilet alert 💩", err);
  }
}

// Make it like a routinary sync for every 10 seconds but you can adjust line 135 if you wish to make changes.
setInterval(() => {
  const now = new Date().toString(); // raw system date-time, timezone of the server
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_TAX MARRIAGE TWO routinary 10 seconds checkMatches***`);
  main();
}, 10000); // 10 seconds cycle
