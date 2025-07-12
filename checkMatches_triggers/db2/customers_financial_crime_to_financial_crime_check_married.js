// Initially tested with IBM DB2, this file contributed to the mini project's evolution, which eventually migrated to PostgreSQL—completing the proof of concept.
// Contributions are welcome for IBM DB2-related enhancements, or check out the PostgreSQL-aligned JS files for reference.

// Ron Penones | July 12th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const ibmdb = require("ibm_db");

const housingConnStr = "DATABASE=HOUSING;HOSTNAME=192.168.137.97;PORT=25000;PROTOCOL=TCPIP;UID=db2inst1;PWD=password;";
const dojConnStr = "DATABASE=DOJ;HOSTNAME=192.168.137.97;PORT=25000;PROTOCOL=TCPIP;UID=db2inst1;PWD=password;";

async function checkmarriedtaxcrimeMatches() {
  let housingConn, dojConn;
  const goodGuyTINs = [];

  try {
    housingConn = await ibmdb.open(housingConnStr);
    dojConn = await ibmdb.open(dojConnStr);

    const customerQuery = `
      SELECT MEG_BIR_TIN_MARRIED 
      FROM MEGAPLANET.CUSTOMERS_TAX
      WHERE MEG_BIR_TIN_MARRIED IS NOT NULL
    `;
    const customers = await housingConn.query(customerQuery);

    for (const { MEG_BIR_TIN_MARRIED: tin } of customers) {
      const crimeQuery = `
        SELECT CRIME_STATUS 
        FROM BAGONGPILIPINAS.FINANCIAL_CRIME_CHECK 
        WHERE CRIME_CEDULA_TIN = ?
        FETCH FIRST 1 ROWS ONLY
      `;
      const result = await dojConn.query(crimeQuery, [tin]);

      if (result.length === 0) {
        console.log(`TIN ${tin} financial crime record negative`);
        goodGuyTINs.push(tin);
      } else {
        const status = result[0].CRIME_STATUS.toLowerCase();
        if (status === "acquitted" || status === "dismissed") {
          console.log(`TIN ${tin} financial crime record negative`);
          goodGuyTINs.push(tin);
        } else {
          console.log(`TIN ${tin} financial crime record positive`);
        }
      }
    }

    if (goodGuyTINs.length > 0) {
      const placeholders = goodGuyTINs.map(() => "?").join(", ");
      const getIDsQuery = `
        SELECT MEG_ID 
        FROM MEGAPLANET.CUSTOMERS_TAX 
        WHERE MEG_BIR_TIN_MARRIED IN (${placeholders})
      `;
      const idsResult = await housingConn.query(getIDsQuery, goodGuyTINs);
      const goodGuyIDs = idsResult.map(row => row.MEG_ID);

      for (const id of goodGuyIDs) {
        const updateQuery = `
          UPDATE MEGAPLANET.CUSTOMERS_FINANCIAL_CRIME 
          SET MEG_FIN_MARRIED_CRIME_CLEAR = '0' 
          WHERE MEG_ID = ?
        `;
        await housingConn.query(updateQuery, [id]);
        console.log(`📌 Updated MEG_FIN_MARRIED_CRIME_CLEAR to '0' for MEG_ID: ${id}`);
      }
    } else {
    }

  } catch (err) {
    console.error("🚽 skibidi toilet alert 💩", err);
  } finally {
    if (housingConn) housingConn.close();
    if (dojConn) dojConn.close();
  }
}

// Make it like a routinary sync for every 10 seconds but you can adjust line 79 if you wish to make changes.
setInterval(() => {
  console.log("***MEGAPLANET.CUSTOMERS_FINANCIAL_CRIME routinary 10 seconds checkMatches***");
  checkmarriedtaxcrimeMatches();
}, 10000);
