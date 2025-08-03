// Ron Penones | August 3rd 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const { Client } = require('pg');
const mysql = require('mysql2/promise');

let pgClient = null;
let mysqlConn = null;

async function connectClients() {
  if (pgClient) await pgClient.end().catch(() => {});
  if (mysqlConn) await mysqlConn.end().catch(() => {});

  pgClient = new Client({
    host: '192.168.137.97',
    user: 'donnahp',
    password: 'password',
    database: 'housing',
  });

  await pgClient.connect();
}

async function floodGateAndHouseKeeping() {
  const now = new Date().toString();
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_POTENTIAL floodGate is closing for the next 90 seconds - Housekeeping will clear MOBILE, TAX, and FINANCIAL_CRIME tables while the floodGate is closed***`);

  // Wait for 30 seconds before ETL housekeeping
  await new Promise(resolve => setTimeout(resolve, 30000));
  const etlTime = new Date().toString();
  console.log(`[${etlTime}] ***MEGAPLANET schema is performing ETL for any remaining unprocessed data from the prominent tables for the next 30 seconds before official housekeeping begins***`);

  // Wait another 30 seconds - total 60 now
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    await connectClients(); // reconnect before delete

    await pgClient.query(`DELETE FROM megaplanet.customers_mobile`);
    await pgClient.query(`DELETE FROM megaplanet.customers_tax`);
    await pgClient.query(`DELETE FROM megaplanet.customers_financial_crime`);

    const cleanedTime = new Date().toString();
    console.log(`[${cleanedTime}] ***MEGAPLANET successfully completed housekeeping - floodGate will reopen in less than 30 seconds***`);
  } catch (err) {
    const errTime = new Date().toString();
    console.error(`[${errTime}] ERROR during housekeeping: ${err.message}`);
  }

  // Wait remaining 30 seconds to reach full 90 seconds
  await new Promise(resolve => setTimeout(resolve, 30000));

  const reopenedTime = new Date().toString();
  console.log(`[${reopenedTime}] ***MEGAPLANET.CUSTOMERS_POTENTIAL floodGate is now open for the next 180 seconds - Data insertion and ETL activities have resumed***`);
}

// Make it like a routinary sync for every 180 seconds but you can adjust line 63 if you wish to make changes.
// This ETL cycle spans 270 seconds in total: 90 seconds for floodGate closure and housekeeping, followed by 180 seconds of open state.
setInterval(() => {
  floodGateAndHouseKeeping().catch(err => {
    const failTime = new Date().toString();
    console.error(`[${failTime}] "🚽 skibidi toilet alert 💩" ${err.message}`);
  });
}, 180000); // 180 seconds cycle

// Initial launch
floodGateAndHouseKeeping();