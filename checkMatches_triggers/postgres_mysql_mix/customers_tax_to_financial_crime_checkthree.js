// Ron Penones | July 31st 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

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
    user: 'donnahp',
    password: 'password',
    database: 'DOJ',
    multipleStatements: true,
  });

  await pgClient.connect();
}

function normalizeStatus(status) {
  if (!status) return '';
  return String(status).trim();
}

function isConvicted(status) {
  return normalizeStatus(status).toLowerCase() === 'convicted';
}

function toYMD(dateLike) {
  if (!dateLike) return '';
  try {
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function logStep2(megId, tin) {
}

function logHasCase(megId, tin, status, updatedAt) {
  const when = updatedAt ? toYMD(updatedAt) : '';
}

function logNoCase(megId, tin) {
}

function logUpdateZeroWithCase(megId, tin, status, updatedAt) {
  const when = updatedAt ? toYMD(updatedAt) : '';
  console.log(
    `MEG_ID ${megId} uses MEG_BIR_TIN_MARRIED ${tin} — confirmed to have a '${status}' financial criminal case; last updated ${when} in DOJ records, which deserves to receive a value of ('0') in megaplanet.customers_financial_crime`
  );
}

function logUpdateZeroNoCase(megId, tin) {
  console.log(
    `MEG_ID ${megId} uses MEG_BIR_TIN_MARRIED ${tin} — confirmed to have no financial criminal case in DOJ records, which deserves to receive a value of ('0') in megaplanet.customers_financial_crime`
  );
}

function logUpdateOneConvicted(megId, tin, updatedAt) {
  const when = updatedAt ? toYMD(updatedAt) : '';
  console.log(
    `MEG_ID ${megId} uses MEG_BIR_TIN_MARRIED ${tin} — confirmed to have a 'Convicted' financial criminal case; last updated ${when} in DOJ records, which deserves to receive a value of ('1') in megaplanet.customers_financial_crime`
  );
}

async function runCheckMatches() {
  // Pull TINs from megaplanet.customers_tax
  const selectTaxSql = `
    SELECT meg_id, meg_bir_tin_married
    FROM megaplanet.customers_tax
  `;
  const taxRes = await pgClient.query(selectTaxSql);

  // Possible update statement in megaplanet.customers_financial_crime
  const updateCrimeClearSql = `
    UPDATE megaplanet.customers_financial_crime
    SET meg_fin_married_crime_clear = $1
    WHERE meg_id = $2
  `;

  for (const row of taxRes.rows) {
    const megId = row.meg_id;
    const tin = (row.meg_bir_tin_married ?? '').toString().trim();

    if (!tin) {
      continue;
    }

    logStep2(megId, tin);

    // Check DOJ financial_crime_check by crime_cedula_tin
    const [dojRows] = await mysqlConn.execute(
      `
      SELECT crime_status, updated_at
      FROM financial_crime_check
      WHERE crime_cedula_tin = ?
      ORDER BY updated_at DESC
      LIMIT 1
      `,
      [tin]
    );

    if (dojRows.length === 0) {
      // No DOJ record
      logNoCase(megId, tin);

      // No case set '0'
      await pgClient.query(updateCrimeClearSql, ['0', megId]);
      logUpdateZeroNoCase(megId, tin);
      continue;
    }

    const { crime_status, updated_at } = dojRows[0];
    const status = normalizeStatus(crime_status);

    logHasCase(megId, tin, status || 'Unknown', updated_at);

    // updates
    if (isConvicted(status)) {
      // CONVICTED set '1'
      await pgClient.query(updateCrimeClearSql, ['1', megId]);
      logUpdateOneConvicted(megId, tin, updated_at);
    } else {
      // Non-convicted set '0'
      await pgClient.query(updateCrimeClearSql, ['0', megId]);
      logUpdateZeroWithCase(megId, tin, status || 'Unknown', updated_at);
    }
  }
}

async function main() {
  await connectClients();
  await runCheckMatches();
}

module.exports = {
  connectClients,
  runCheckMatches,
  main,
  get pg() {
    return pgClient;
  },
  get mysql() {
    return mysqlConn;
  },
};

// Make it like a routinary sync for every 10 seconds but you can adjust line 186 if you wish to make changes.
let isRunning = false;

setInterval(() => {
  if (isRunning) return;
  isRunning = true;

  const now = new Date().toString(); // raw system date-time, timezone of the server
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_TAX MARRIAGE CRIME THREE routinary 10 seconds checkMatches***`);

  main()
    .catch(err => {
      const errorTime = new Date().toString();
      console.error(`[${errorTime}] "🚽 skibidi toilet alert 💩" ${err?.message || err}`);
      console.error(err);
    })
    .finally(() => {
      isRunning = false;
    });

}, 10000); // 10 seconds cycle