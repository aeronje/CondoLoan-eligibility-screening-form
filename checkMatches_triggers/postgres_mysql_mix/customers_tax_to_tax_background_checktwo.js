// Ron Penones | August 3rd 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

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
  });
  await pgClient.connect();

  mysqlConn = await mysql.createConnection({
    host: '192.168.137.97',
    database: 'bir',
    user: 'donnahp',
    password: 'password',
  });
}

// Make it like a routinary sync for every 10 seconds but you can adjust line 51 if you wish to make changes.
let isRunning = false;

setInterval(() => {
  if (isRunning) return;
  isRunning = true;

  const now = new Date().toString();
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_TAX GROSS PHP ELIGIBILITY TWO routinary 10 seconds checkMatches***`);

  main()
    .catch(err => {
      const errorTime = new Date().toString(); // raw system date-time, timezone of the server
      console.error(`[${errorTime}] "🚽 skibidi toilet alert 💩" ${err?.message || err}`);
      console.error(err);
    })
    .finally(() => {
      isRunning = false;
    });

}, 10000); // 10 seconds

async function main() {
  await connectClients();

  // Fetch MEG_ID and meg_bir_tin_married from customers_tax
  const { rows: customerRows } = await pgClient.query(`
    SELECT meg_id, meg_bir_tin_married 
    FROM megaplanet.customers_tax
    WHERE meg_bir_tin_married IS NOT NULL
  `);

  for (const row of customerRows) {
    const { meg_id, meg_bir_tin_married } = row;

    console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married}`);

    // Check if TIN exists
    const [taxRows] = await mysqlConn.execute(
      `SELECT tax_last_fiscal_gross_php 
       FROM tax_background_check 
       WHERE tax_identification_number = ?`,
      [meg_bir_tin_married]
    );

    if (taxRows.length === 0) {
      console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have no valid tax_identification_number in BIR records`);
      continue;
    }

    console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have a valid tax_identification_number in BIR records`);

    // Check if gross is eligible (>= 500000)
    const gross = parseFloat(taxRows[0].tax_last_fiscal_gross_php || 0);

    if (gross >= 500000) {
      console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have a valid tax_identification_number with the ELIGIBLE taxable gross amount in BIR records`);

      // Update with '0' if > or = 500k
      await pgClient.query(`
        UPDATE megaplanet.customers_tax
        SET meg_bir_tin_married__gross_php_eligible = '0'
        WHERE meg_id = $1
      `, [meg_id]);

      console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have a valid tax_identification_number with the ELIGIBLE taxable gross amount in BIR records and deserves to receive a value of ('0') in megaplanet.customers_tax`);
    } else {
      console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have a valid tax_identification_number with the INELIGIBLE taxable gross amount in BIR records`);

      // Update with '0' if < 500k
      await pgClient.query(`
        UPDATE megaplanet.customers_tax
        SET meg_bir_tin_married__gross_php_eligible = '1'
        WHERE meg_id = $1
      `, [meg_id]);

      console.log(`MEG_ID ${meg_id} uses meg_bir_tin_married ${meg_bir_tin_married} is confirmed to have a valid tax_identification_number with the INELIGIBLE taxable gross amount in BIR records and deserves to receive a value of ('1') in megaplanet.customers_tax`);
    }
  }
}