// Ron Penones | July 16th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

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
    port: 5432
  });

  mysqlConn = await mysql.createConnection({
    host: '192.168.137.97',
    user: 'donnahp',
    password: 'password',
    multipleStatements: true
  });

  await pgClient.connect();
}

async function fetchCustomersTax() {
  const query = `SELECT meg_id, meg_bir_tin_principal, meg_bir_tin_married FROM megaplanet.customers_tax`;
  const res = await pgClient.query(query);
  const principalTins = res.rows.map(row => row.meg_bir_tin_principal);
  const marriedTins = res.rows.map(row => row.meg_bir_tin_married);

  console.log(`Preparing for checkMatches using the available meg_bir_tin_principal = ${principalTins.join(', ')}`);
  console.log(`Preparing for checkMatches using the available meg_bir_tin_married = ${marriedTins.join(', ')}`);

  return res.rows;
}

async function fetchFinancialCrimeCheck() {
  await mysqlConn.query("USE DOJ");
  const [rows] = await mysqlConn.query(`
    SELECT crime_case_number, crime_status, crime_cedula_tin, crime_law_code, updated_at 
    FROM financial_crime_check
  `);
  console.log('Preparing for checkMatches using the available data from DOJ records');
  return rows;
}

async function fetchMarriageCertCheck() {
  await mysqlConn.query("USE PSA");
  const [rows] = await mysqlConn.query(`
    SELECT mar_date, mar_cedula_tin_husband, mar_cedula_tin_wife 
    FROM marriage_cert_check
  `);
  console.log('Preparing for checkMatches using the available data from PSA records');
  return rows;
}

async function main() {
  await connectClients();

  const customersTax = await fetchCustomersTax();
  const financialCrime = await fetchFinancialCrimeCheck();
  const marriageCert = await fetchMarriageCertCheck();

  let positiveFindings = [];

  for (const customer of customersTax) {
    const matches = financialCrime.filter(fc => 
      fc.crime_cedula_tin === customer.meg_bir_tin_principal || 
      fc.crime_cedula_tin === customer.meg_bir_tin_married
    );

    if (matches.length > 0) {
      for (const match of matches) {
        console.log(`meg_id# ${customer.meg_id} with TIN ${match.crime_cedula_tin} is confirmed to have a crime_case_number ${match.crime_case_number} violation with crime_law_code ${match.crime_law_code} last updated at ${match.updated_at} status ${match.crime_status}`);
        if (match.crime_status.toLowerCase() === 'convicted') {
          positiveFindings.push({
            meg_id: customer.meg_id,
            principal: customer.meg_bir_tin_principal,
            married: customer.meg_bir_tin_married,
            crime: match
          });
          console.log(`MEG_ID ${customer.meg_id} with TIN ${match.crime_cedula_tin} is confirmed to have an existing financial crime violation ${match.crime_law_code} last updated at ${match.updated_at} for ${match.crime_case_number} and the status is convicted`);
        }
      }
    } else {
      console.log(`No record found for meg_id ${customer.meg_id} in the DOJ financial_crime_check`);
    }
  }

  // Marriage checkMatches
  const megIdsConvicted = positiveFindings.map(pf => pf.meg_id);
  const convictedCustomers = customersTax.filter(c => megIdsConvicted.includes(c.meg_id));

  for (const customer of convictedCustomers) {
    const isInMarriage = marriageCert.some(mar => 
      [mar.mar_cedula_tin_husband, mar.mar_cedula_tin_wife].includes(customer.meg_bir_tin_principal) &&
      [mar.mar_cedula_tin_husband, mar.mar_cedula_tin_wife].includes(customer.meg_bir_tin_married)
    );

    if (isInMarriage) {
      const crime = positiveFindings.find(pf => pf.meg_id === customer.meg_id).crime;
      console.log(`MEG_ID ${customer.meg_id} is confirmed have a legitimate record in PSA records based on the submitted data entry from the megaplanet.customers_potential validated with DOJ records for an existing financial crime violation ${crime.crime_law_code} last updated at ${crime.updated_at} for ${crime.crime_case_number} convicted`);
      
      const marRow = marriageCert.find(mar => 
        [mar.mar_cedula_tin_husband, mar.mar_cedula_tin_wife].includes(customer.meg_bir_tin_principal) &&
        [mar.mar_cedula_tin_husband, mar.mar_cedula_tin_wife].includes(customer.meg_bir_tin_married)
      );
      
      const marDate = new Date(marRow.mar_date);
      const crimeDate = new Date(crime.updated_at);

      if (crimeDate < marDate) {
        await pgClient.query(`
          UPDATE megaplanet.customers_potential_semi_shortlisted
          SET meg_financial_crime_cleared = '2'
          WHERE meg_id = $1
        `, [customer.meg_id]);

        console.log(`MEG_ID ${customer.meg_id} is validated with DOJ and PSA records committed a financial crime violation ${crime.crime_law_code} before marriage. This will set the special value of '2' in MEGAPLANET.CUSTOMERS_POTENTIAL_SHORTLISTED, the rest of other MEG_ID with convicted financial crime status will be treated as regular value of '1'`);
      }
    }
  }

  await pgClient.end();
  await mysqlConn.end();
}

// Make it like a routinary sync for every second but you can adjust line 148 if you wish to make changes.
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