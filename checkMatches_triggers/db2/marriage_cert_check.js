// Initially tested with IBM DB2, this file contributed to the mini project's evolution, which eventually migrated to PostgreSQL—completing the proof of concept.
// Contributions are welcome for IBM DB2-related enhancements, or check out the PostgreSQL-aligned JS files for reference.

// Ron Penones | July 12th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const ibmdb = require('ibm_db');

const dbConfigHOUSING = {
  database: 'HOUSING',
  hostname: '192.168.137.97',
  port: 25000,
  protocol: 'TCPIP',
  uid: 'db2inst1',
  pwd: 'password',
};

const dbConfigPSA = {
  database: 'PSA',
  hostname: '192.168.137.97',
  port: 25000,
  protocol: 'TCPIP',
  uid: 'db2inst1',
  pwd: 'password',
};

async function marriagecertcheckMatches() {
  let housingConn;
  let psaConn;

  try {
    housingConn = await ibmdb.open(dbConfigHOUSING);
    psaConn = await ibmdb.open(dbConfigPSA);

    // Capture MEG_BIR_TIN_MARRIED values
    const marriedTINs = await housingConn.query(`
      SELECT MEG_ID, MEG_BIR_TIN_MARRIED FROM MEGAPLANET.CUSTOMERS_TAX 
      WHERE MEG_BIR_TIN_MARRIED IS NOT NULL
    `);

    for (const record of marriedTINs) {
      const marriedTIN = record.MEG_BIR_TIN_MARRIED;
      const megId = record.MEG_ID;
      let partnerTIN = null;
      let foundCondition = null;

      // Two SQL commands are needed but only 1 command should provide a successful result, if none of these commands returned anything then the MEG_BIR_TIN_MARRIED possibly not married
      const asHusband = await psaConn.query(`
        SELECT MAR_DATE, MAR_CEDULA_TIN_HUSBAND, MAR_CEDULA_TIN_WIFE 
        FROM BAGONGPILIPINAS.MARRIAGE_CERT_CHECK 
        WHERE MAR_CEDULA_TIN_HUSBAND = '${marriedTIN}'
        FETCH FIRST 1 ROWS ONLY
      `);

      
      const asWife = asHusband.length === 0
        ? await psaConn.query(`
            SELECT MAR_DATE, MAR_CEDULA_TIN_HUSBAND, MAR_CEDULA_TIN_WIFE 
            FROM BAGONGPILIPINAS.MARRIAGE_CERT_CHECK 
            WHERE MAR_CEDULA_TIN_WIFE = '${marriedTIN}'
            FETCH FIRST 1 ROWS ONLY
          `)
        : [];

      if (asHusband.length > 0) {
        partnerTIN = asHusband[0].MAR_CEDULA_TIN_WIFE;
        foundCondition = `MAR_CEDULA_TIN_HUSBAND = '${marriedTIN}'`;
        console.log(`YES - RECORD FOUND using the condition of ${foundCondition} which provides the result of the partner's TIN: '${partnerTIN}'`);
      } else if (asWife.length > 0) {
        partnerTIN = asWife[0].MAR_CEDULA_TIN_HUSBAND;
        foundCondition = `MAR_CEDULA_TIN_WIFE = '${marriedTIN}'`;
        console.log(`YES - RECORD FOUND using the condition of ${foundCondition} which provides the result of the partner's TIN: '${partnerTIN}'`);
      } else {
        console.log(`NO - Nothing found for TIN '${marriedTIN}'`);
        continue;
      }

      // The partnerTIN is assumed to be the spouse of the MEG_BIR_TIN_MARRIED value
      // If no result is returned from the SQL command below then it means that MEG_BIR_TIN_MARRIED is either married to someone else or the partnerTIN refers to a different person
      const partnerRecord = await housingConn.query(`
        SELECT MEG_ID FROM MEGAPLANET.CUSTOMERS_TAX 
        WHERE MEG_BIR_TIN_PRINCIPAL = '${partnerTIN}' 
        FETCH FIRST 1 ROWS ONLY
      `);

      if (partnerRecord.length > 0) {
        console.log(`Partner's MEG_ID found: ${partnerRecord[0].MEG_ID}`);
      } else {
        console.log(`TIN ${marriedTIN}' is married according to the PSA database but not married with the principal buyer - kabet yarn?`);
      }
    }

  } catch (err) {
    console.error('🔥 Error occurred:', err);
  } finally {
    if (housingConn) housingConn.close(() => {});
    if (psaConn) psaConn.close(() => {});
  }
}

marriagecertcheckMatches();
