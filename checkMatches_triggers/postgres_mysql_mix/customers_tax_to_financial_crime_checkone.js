// Ron Penones | July 30th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const { Client } = require('pg');
const mysql = require('mysql2/promise');

let pgClient = null;
let mysqlConn = null;

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
    multipleStatements: true,
  });

  await pgClient.connect();
}

async function main() {
  await connectClients();

  // Fetch TINs from customers_tax
  const taxResult = await pgClient.query(
    'SELECT meg_id, meg_bir_tin_principal, meg_bir_tin_married FROM megaplanet.customers_tax'
  );
  const taxRecords = taxResult.rows.map((row) => {
    return row;
  });

  // Fetch marriage records
  await mysqlConn.query('USE PSA');
  const [marriageRows] = await mysqlConn.query(
    'SELECT mar_registry_number, mar_date, mar_cedula_tin_husband, mar_cedula_tin_wife FROM marriage_cert_check'
  );

  // Match MEG_IDs with marriage data
  const matchedCouples = [];
  for (const row of taxRecords) {
    for (const marriage of marriageRows) {
      const tins = [
        row.meg_bir_tin_principal,
        row.meg_bir_tin_married,
      ];
      const coupleTins = [
        marriage.mar_cedula_tin_husband,
        marriage.mar_cedula_tin_wife,
      ];
      if (
        tins.includes(coupleTins[0]) &&
        tins.includes(coupleTins[1])
      ) {
        matchedCouples.push({
          meg_id: row.meg_id,
          tins,
          mar_date: marriage.mar_date,
        });
      }
    }
  }

  // Fetch confirmed positive MEG_IDs
  const finalTINs = [];
  for (const match of matchedCouples) {
    const { meg_id, tins } = match;
    const result = await pgClient.query(
      'SELECT meg_id, meg_bir_tin_principal, meg_bir_tin_married FROM megaplanet.customers_tax WHERE meg_id = $1',
      [meg_id]
    );
    result.rows.forEach((r) => {
      finalTINs.push({
        meg_id: r.meg_id,
        tins: [r.meg_bir_tin_principal, r.meg_bir_tin_married],
        mar_date: match.mar_date,
      });
    });
  }

  // Query DOJ database for financial crimes
  await mysqlConn.query('USE DOJ');
  const convictedRecords = [];
  for (const item of finalTINs) {
    for (const tin of item.tins) {
      const [doj] = await mysqlConn.query(
        'SELECT crime_status, updated_at FROM financial_crime_check WHERE crime_cedula_tin = ?',
        [tin]
      );
      doj.forEach((record) => {
        if (record.crime_status.toLowerCase() === 'convicted') {
          convictedRecords.push({
            meg_id: item.meg_id,
            tin,
            updated_at: new Date(record.updated_at),
            mar_date: new Date(item.mar_date),
          });
        }
      });
    }
  }

  // Attach marriage date
  convictedRecords.forEach((rec) => {
  });

  // Categorize the crimes
  const classifiedRecords = convictedRecords.map((rec) => {
    const isMarriedCrime = rec.updated_at > rec.mar_date;
    const label = isMarriedCrime ? 'married crime' : 'bachelor crime';
    return {
      ...rec,
      category: label,
    };
  });

  // Segregate only single party bachelor crimes
  const countMap = {};
  for (const rec of classifiedRecords) {
    if (rec.category === 'bachelor crime') {
      countMap[rec.meg_id] = (countMap[rec.meg_id] || 0) + 1;
    }
  }

  const singlePartyBachelors = classifiedRecords.filter(
    (rec) => rec.category === 'bachelor crime' && countMap[rec.meg_id] === 1
  );

  singlePartyBachelors.forEach((rec) => {
  });

  // Final Update Query
  const megIDsToUpdate = [...new Set(singlePartyBachelors.map((rec) => rec.meg_id))];
  for (const meg_id of megIDsToUpdate) {
    await pgClient.query(
      `UPDATE megaplanet.customers_potential_semi_shortlisted SET meg_financial_crime_cleared = '2' WHERE meg_id = $1`,
      [meg_id]
    );
  }
  if (megIDsToUpdate.length > 0) {
  console.log(
    `Updated meg_financial_crime_cleared value to '2' in megaplanet.customers_potential_semi_shortlisted for MEG_IDs: ${megIDsToUpdate.join(", ")}, please validate clearance status in megaplanet.customers_financial_crime to ensure that at least one linked party is cleared ('0')`
  );
}
  await pgClient.end();
  await mysqlConn.end();
}

// Make it like a routinary sync for every second but you can adjust line 170 if you wish to make changes.
// Intentionally set to run on every second cycle to reduce conflicts with customers_tax_to_financial_crime_checktwo.js and customers_tax_to_financial_crime_checkthree.js, caused by the rapid value fluctuations of '2' in the meg_financial_crime_cleared field within the megaplanet.customers_potential_semi_shortlisted table.
setInterval(() => {
  const now = new Date().toString(); // raw system date-time, timezone of the server
  console.log(`[${now}] ***MEGAPLANET.CUSTOMERS_TAX MARRIAGE CRIME ONE rapid checkMatches***`);
  main()
    .catch(err => {
      const errorTime = new Date().toString();
      console.error(`[${errorTime}] "🚽 skibidi toilet alert 💩" ${err.message || err}`);
      console.error(err); 
    });

}, 1000); // every second cycle
