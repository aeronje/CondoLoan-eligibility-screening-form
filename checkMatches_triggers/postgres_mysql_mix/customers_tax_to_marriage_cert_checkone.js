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
    password: 'Puday69!',
    port: 5432,
  });

  mysqlConn = await mysql.createConnection({
    host: '192.168.137.97',
    database: 'psa',
    user: 'donnahp',
    password: 'Puday69!',
  });

  await pgClient.connect();
}

async function checkmarriageoneMatches() {
  const { rows } = await pgClient.query(
    `SELECT meg_id, meg_first_name, meg_bir_tin_principal FROM megaplanet.customers_tax WHERE meg_bir_tin_married = 'notmarried'`
  );
  if (rows.length === 0) {
    console.log('No MEG_IDs found with meg_bir_tin_married = notmarried');
    return;
  }
  console.log(`MEG_IDs found to be not married: ${rows.map(r => r.meg_id).join(', ')}`);

  for (const row of rows) {
    const { meg_bir_tin_principal: principalTin } = row;
    const [psaRows] = await mysqlConn.execute(
      `SELECT 1 FROM marriage_cert_check WHERE mar_cedula_tin_husband = ? OR mar_cedula_tin_wife = ? LIMIT 1`,
      [principalTin, principalTin]
    );

    if (psaRows.length > 0) {
      console.log(`POSITIVE - meg_bir_tin_principal ${principalTin} was found in PSA records`);
    } else {
      console.log(`NEGATIVE - meg_bir_tin_principal ${principalTin} was not found in PSA records`);
      await pgClient.query(
        `UPDATE megaplanet.customers_tax SET meg_bir_tin_married = 'notmarried' WHERE meg_bir_tin_principal = $1`,
        [principalTin]
      );
    }
  }
}

async function validateExistingMarriages() {
  const { rows } = await pgClient.query(
    `SELECT meg_id, meg_bir_tin_principal, meg_bir_tin_married FROM megaplanet.customers_tax WHERE meg_bir_tin_married != 'notmarried'`
  );

  if (rows.length === 0) {
    console.log('No married MEG_IDs found for validation');
    return;
  }

  for (const row of rows) {
    const { meg_id, meg_bir_tin_principal: principalTin, meg_bir_tin_married: marriedTin } = row;

    // PSA Check if meg_bir_tin_married exists as either husband or wife
    const [psaRows] = await mysqlConn.execute(
      `SELECT 1 FROM marriage_cert_check WHERE mar_cedula_tin_husband = ? OR mar_cedula_tin_wife = ? LIMIT 1`,
      [marriedTin, marriedTin]
    );

    if (psaRows.length === 0) {
      console.log(`NEGATIVE - meg_bir_tin_married = '${marriedTin}' not found in PSA, updating to notmarried`);
      await pgClient.query(
        `UPDATE megaplanet.customers_tax SET meg_bir_tin_married = 'notmarried' WHERE meg_id = $1`,
        [meg_id]
      );
      continue;
    }

    // Cross validation between principal and married
    const { rows: crossRows } = await pgClient.query(
      `SELECT meg_id FROM megaplanet.customers_tax WHERE (meg_bir_tin_principal = $1 AND meg_bir_tin_married = $2) OR (meg_bir_tin_principal = $2 AND meg_bir_tin_married = $1)` ,
      [principalTin, marriedTin]
    );

    if (crossRows.length > 0) {
      console.log(`POSITIVE - MEG_ID ${crossRows.map(r => r.meg_id).join(', ')} legitimate marriage entry.`);
    } else {
      console.log(`NEGATIVE - MEG_ID ${meg_id} invalid marriage pairing, updating to notmarried`);
      await pgClient.query(
        `UPDATE megaplanet.customers_tax SET meg_bir_tin_married = 'notmarried' WHERE meg_id = $1`,
        [meg_id]
      );
    }
  }
}

async function main() {
  try {
    await connectClients();
    await checkmarriageoneMatches();
    await validateExistingMarriages();
  } catch (err) {
    console.error("🚽 skibidi toilet alert 💩", err);
  }
}

// Make it like a routinary sync for every 10 seconds but you can adjust line 123 if you wish to make changes.
setInterval(() => {
  const now = new Date().toString(); // raw system date-time, timezone of the server
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_TAX MARRIAGE ONE routinary 10 seconds checkMatches***`);
  main();
}, 10000); // 10 seconds cycle