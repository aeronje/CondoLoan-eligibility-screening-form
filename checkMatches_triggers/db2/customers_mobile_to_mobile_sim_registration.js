// Initially tested with IBM DB2, this file contributed to the mini project's evolution, which eventually migrated to PostgreSQL—completing the proof of concept.
// Contributions are welcome for IBM DB2-related enhancements, or check out the PostgreSQL-aligned JS files for reference.

// Ron Penones | June 12th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const ibmdb = require('ibm_db');

const housingConnStr = "DATABASE=HOUSING;HOSTNAME=192.168.137.97;UID=db2inst1;PWD=password!;PORT=25000;PROTOCOL=TCPIP";
const ntcConnStr = "DATABASE=NTC;HOSTNAME=192.168.137.97;UID=db2inst1;PWD=password!;PORT=25000;PROTOCOL=TCPIP";

async function checkmobileMatches() {
  const housingDb = await ibmdb.open(housingConnStr);
  const ntcDb = await ibmdb.open(ntcConnStr);

  try {
    const housingPhonesRes = await housingDb.query("SELECT MEG_PHONE FROM MEGAPLANET.CUSTOMERS_MOBILE");
    const ntcPhonesRes = await ntcDb.query("SELECT MOBILE_SIM_NUMBER, MOBILE_SIM_FIRST_NAME, MOBILE_SIM_LAST_NAME FROM BAGONGPILIPINAS.MOBILE_SIM_REGISTRATION");

    const housingPhones = housingPhonesRes.map(r => r.MEG_PHONE.trim());
    const ntcPhones = ntcPhonesRes.map(r => ({
      number: r.MOBILE_SIM_NUMBER.trim(),
      firstName: r.MOBILE_SIM_FIRST_NAME.trim(),
      lastName: r.MOBILE_SIM_LAST_NAME.trim()
    }));

    const matched = [];
    const megIdsToUpdate = [];

    for (let hp of housingPhones) {
      const match = ntcPhones.find(np => np.number === hp);
      if (match) {
        console.log(`63${hp} record positive`);
        matched.push(match);
      } else {
        console.log(`63${hp} record negative`);
      }
    }

    for (let match of matched) {
      const detailsQuery = `SELECT MOBILE_SIM_FIRST_NAME, MOBILE_SIM_LAST_NAME, MOBILE_SIM_NUMBER FROM BAGONGPILIPINAS.MOBILE_SIM_REGISTRATION WHERE MOBILE_SIM_NUMBER = ?`;
      const [details] = await ntcDb.query(detailsQuery, [match.number]);

      if (!details) {
        console.log(`⚠️ No result for ${match.number}`);
        continue;
      }

      console.log(`\n✅ checkMatches findings`);
      console.log(`Phone: +63${details.MOBILE_SIM_NUMBER}`);

      const first2FirstName = details.MOBILE_SIM_FIRST_NAME.slice(0, 2).toLowerCase();
      const first2LastName = details.MOBILE_SIM_LAST_NAME.slice(0, 2).toLowerCase();
      const phone = details.MOBILE_SIM_NUMBER;

      const housingQuery = `
        SELECT MEG_ID FROM MEGAPLANET.CUSTOMERS_MOBILE
        WHERE LOWER(MEG_FIRST_NAME) LIKE ?
        AND LOWER(MEG_LAST_NAME) LIKE ?
        AND MEG_PHONE = ?
      `;

      const idsRes = await housingDb.query(housingQuery, [`${first2FirstName}%`, `${first2LastName}%`, phone]);

      if (idsRes.length > 0) {
        const ids = idsRes.map(r => r.MEG_ID);
        console.log(`👍 Matched MEG_ID: ${ids.join(', ')}`);
        megIdsToUpdate.push(...ids);
      } else {
        console.log(`✋ +63${phone} is registered in the NTC database but name mismatch prevents updating meg_phone_legitimacy to 0.`);
      }
    }

    // Update MEG_PHONE_LEGITIMACY to '0' if there are matching MEG_IDs
    if (megIdsToUpdate.length > 0) {
      const placeholders = megIdsToUpdate.map(() => '?').join(', ');
      const updateQuery = `
        UPDATE MEGAPLANET.CUSTOMERS_MOBILE
        SET MEG_PHONE_LEGITIMACY = '0'
        WHERE MEG_ID IN (${placeholders})
      `;
      await housingDb.query(updateQuery, megIdsToUpdate);
      console.log(`📌 Updated MEG_PHONE_LEGITIMACY to '0' for MEG_IDs: ${megIdsToUpdate.join(', ')}`);
    } else {
    }

  } catch (err) {
    console.error("🚽 skibidi toilet alert 💩", err);
  } finally {
    await housingDb.close();
    await ntcDb.close();
  }
}
// Make it like a routinary sync for every 10 seconds but you can adjust line 93 if you wish to make changes.
setInterval(() => {
  console.log("***MEGAPLANET.CUSTOMERS_MOBILE routinary 10 seconds checkMatches***");
  checkmobileMatches();
}, 10000);