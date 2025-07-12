// Ron Penones | July 12th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

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
    user: 'donnahp',
    password: 'password',
    database: 'housing',
  });

  mysqlConn = await mysql.createConnection({
    host: '192.168.137.97',
    user: 'donnahp',
    password: 'password',
    database: 'ntc',
  });

  await pgClient.connect();
}

// The main logic
async function checkmobileMatches() {
  try {
    await connectClients(); // Fresh connection every 10s

    const { rows: customers } = await pgClient.query(`
      SELECT meg_id, meg_first_name, meg_last_name, meg_phone
      FROM megaplanet.customers_mobile
    `);

    const [simData] = await mysqlConn.execute(`
      SELECT mobile_sim_number, mobile_sim_first_name, mobile_sim_last_name
      FROM mobile_sim_registration
    `);

    const matchedMegIds = [];

    for (const customer of customers) {
      const matchedSim = simData.find(sim =>
        sim.mobile_sim_number === customer.meg_phone
      );

      if (matchedSim) {
        console.log(`YES - +63${customer.meg_phone} exists in mobile_sim_registration`);
        console.log(`mobile_sim_number +63${customer.meg_phone} matched for MEG_ID #${customer.meg_id}`);

        const customerFirst2 = (customer.meg_first_name || '').substring(0, 2).toLowerCase();
        const customerLast2 = (customer.meg_last_name || '').substring(0, 2).toLowerCase();
        const simFirst2 = (matchedSim.mobile_sim_first_name || '').substring(0, 2).toLowerCase();
        const simLast2 = (matchedSim.mobile_sim_last_name || '').substring(0, 2).toLowerCase();

        if (customerFirst2 === simFirst2 && customerLast2 === simLast2) {
          console.log(`MEG_ID #${customer.meg_id} for +63${customer.meg_phone} matched first and last names criteria`);
          matchedMegIds.push(String(customer.meg_id));
        } else {
          console.log(`MEG_ID #${customer.meg_id} for +63${customer.meg_phone} does not match first and last names criteria`);
        }

      } else {
        console.log(`NO - +63${customer.meg_phone} does not exist in mobile_sim_registration`);
      }
    }

    if (matchedMegIds.length > 0) {
      const updateQuery = `
        UPDATE megaplanet.customers_mobile
        SET meg_phone_legitimacy = '0'
        WHERE meg_id = ANY($1)
      `;
      await pgClient.query(updateQuery, [matchedMegIds]);
      console.log(`meg_phone_legitimacy updated to 0 for the qualified MEG_IDs: ${matchedMegIds.join(', ')}`);
    } else {
      console.log('No qualified MEG_IDs found for update.');
    }

  } catch (err) {
    console.error("🚽 skibidi toilet alert 💩", err.message);
  }
}

// Make it like a routinary sync for every 10 seconds but you can adjust line 96 if you wish to make changes.
setInterval(() => {
  console.log("***MEGAPLANET.CUSTOMERS_MOBILE routinary 10 seconds checkMatches***");
  checkmobileMatches();
}, 10000);
