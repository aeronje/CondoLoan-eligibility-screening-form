/*
This SQL file is intended for use with PostgreSQL.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for triggers-specific setup.
*/

/*
Ron Penones | July 11th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!
*/

CREATE OR REPLACE FUNCTION megaplanet.sync_customers_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into CUSTOMERS_MOBILE
  INSERT INTO megaplanet.customers_mobile (
    meg_id, meg_first_name, meg_last_name, meg_phone
  ) VALUES (
    NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name, NEW.meg_phone
  );

  -- Insert into CUSTOMERS_TAX
  INSERT INTO megaplanet.customers_tax (
    meg_id, meg_first_name, meg_last_name,
    meg_bir_tin_principal, meg_bir_tin_married
  ) VALUES (
    NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name,
    NEW.meg_bir_tin_principal, NEW.meg_bir_tin_married
  );

  -- Insert into CUSTOMERS_FINANCIAL_CRIME
  INSERT INTO megaplanet.customers_financial_crime (
    meg_id, meg_first_name, meg_last_name
  ) VALUES (
    NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name
  );

  -- Insert into CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED (simplified first step)
  INSERT INTO megaplanet.customers_potential_semi_shortlisted (
    meg_id, meg_first_name, meg_last_name, meg_phone,
    meg_phone_legitimacy, meg_financial_gross_eligible, meg_financial_crime_cleared
  ) VALUES (
    NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name, NEW.meg_phone,
    
    -- phone_legitimacy from customers_mobile (default = 1)
    1,
    
    -- gross eligibility logic (both principal and married must be 1)
    CASE
      WHEN 1 = 1 AND 1 = 1 THEN '1' ELSE '0'
    END,

    -- financial crime cleared logic (default both clear = 1, so not both 0 → means value is 1)
    CASE
      WHEN 1 = 0 AND 1 = 0 THEN '0' ELSE '1'
    END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_insert
AFTER INSERT ON megaplanet.customers_potential
FOR EACH ROW
EXECUTE FUNCTION megaplanet.sync_customers_insert();

CREATE OR REPLACE FUNCTION megaplanet.sync_customers_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update CUSTOMERS_MOBILE
  UPDATE megaplanet.customers_mobile
  SET meg_first_name = NEW.meg_first_name,
      meg_last_name = NEW.meg_last_name,
      meg_phone = NEW.meg_phone
  WHERE meg_id = NEW.meg_id;

  -- Update CUSTOMERS_TAX
  UPDATE megaplanet.customers_tax
  SET meg_first_name = NEW.meg_first_name,
      meg_last_name = NEW.meg_last_name,
      meg_bir_tin_principal = NEW.meg_bir_tin_principal,
      meg_bir_tin_married = NEW.meg_bir_tin_married
  WHERE meg_id = NEW.meg_id;

  -- Update CUSTOMERS_FINANCIAL_CRIME
  UPDATE megaplanet.customers_financial_crime
  SET meg_first_name = NEW.meg_first_name,
      meg_last_name = NEW.meg_last_name
  WHERE meg_id = NEW.meg_id;

  -- Update SEMI_SHORTLISTED with logic
  UPDATE megaplanet.customers_potential_semi_shortlisted
  SET meg_first_name = NEW.meg_first_name,
      meg_last_name = NEW.meg_last_name,
      meg_phone = NEW.meg_phone,
      meg_phone_legitimacy = (
        SELECT meg_phone_legitimacy FROM megaplanet.customers_mobile
        WHERE meg_id = NEW.meg_id
      )::VARCHAR,
      meg_financial_gross_eligible = (
        CASE
          WHEN (
            SELECT meg_bir_tin_principal__gross_php_eligible FROM megaplanet.customers_tax WHERE meg_id = NEW.meg_id
          ) = 1 AND (
            SELECT meg_bir_tin_married__gross_php_eligible FROM megaplanet.customers_tax WHERE meg_id = NEW.meg_id
          ) = 1 THEN '1'
          ELSE '0'
        END
      ),
      meg_financial_crime_cleared = (
        CASE
          WHEN (
            SELECT meg_fin_principal_crime_clear FROM megaplanet.customers_financial_crime WHERE meg_id = NEW.meg_id
          ) = 0 AND (
            SELECT meg_fin_married_crime_clear FROM megaplanet.customers_financial_crime WHERE meg_id = NEW.meg_id
          ) = 0 THEN '0'
          ELSE '1'
        END
      )
  WHERE meg_id = NEW.meg_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_update
AFTER UPDATE ON megaplanet.customers_potential
FOR EACH ROW
EXECUTE FUNCTION megaplanet.sync_customers_update();

CREATE OR REPLACE FUNCTION megaplanet.sync_customers_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM megaplanet.customers_mobile WHERE meg_id = OLD.meg_id;
  DELETE FROM megaplanet.customers_tax WHERE meg_id = OLD.meg_id;
  DELETE FROM megaplanet.customers_financial_crime WHERE meg_id = OLD.meg_id;
  DELETE FROM megaplanet.customers_potential_semi_shortlisted WHERE meg_id = OLD.meg_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_delete
AFTER DELETE ON megaplanet.customers_potential
FOR EACH ROW
EXECUTE FUNCTION megaplanet.sync_customers_delete();

CREATE OR REPLACE FUNCTION megaplanet.update_shortlisted_from_mobile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE megaplanet.customers_potential_semi_shortlisted
  SET meg_phone_legitimacy = NEW.meg_phone_legitimacy::VARCHAR
  WHERE meg_id = NEW.meg_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_shortlisted_from_mobile
AFTER UPDATE OF meg_phone_legitimacy ON megaplanet.customers_mobile
FOR EACH ROW
EXECUTE FUNCTION megaplanet.update_shortlisted_from_mobile();

CREATE OR REPLACE FUNCTION megaplanet.update_shortlisted_from_tax()
RETURNS TRIGGER AS $$
DECLARE
  gross_eligible VARCHAR(1);
BEGIN
  IF NEW.meg_bir_tin_principal__gross_php_eligible = 1 AND NEW.meg_bir_tin_married__gross_php_eligible = 1 THEN
    gross_eligible := '1';
  ELSE
    gross_eligible := '0';
  END IF;

  UPDATE megaplanet.customers_potential_semi_shortlisted
  SET meg_financial_gross_eligible = gross_eligible
  WHERE meg_id = NEW.meg_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_shortlisted_from_tax
AFTER UPDATE OF meg_bir_tin_principal__gross_php_eligible, meg_bir_tin_married__gross_php_eligible
ON megaplanet.customers_tax
FOR EACH ROW
EXECUTE FUNCTION megaplanet.update_shortlisted_from_tax();

CREATE OR REPLACE FUNCTION megaplanet.update_shortlisted_from_crime()
RETURNS TRIGGER AS $$
DECLARE
  crime_clear VARCHAR(1);
BEGIN
  IF NEW.meg_fin_principal_crime_clear = 0 AND NEW.meg_fin_married_crime_clear = 0 THEN
    crime_clear := '0';
  ELSE
    crime_clear := '1';
  END IF;

  UPDATE megaplanet.customers_potential_semi_shortlisted
  SET meg_financial_crime_cleared = crime_clear
  WHERE meg_id = NEW.meg_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_shortlisted_from_crime
AFTER UPDATE OF meg_fin_principal_crime_clear, meg_fin_married_crime_clear
ON megaplanet.customers_financial_crime
FOR EACH ROW
EXECUTE FUNCTION megaplanet.update_shortlisted_from_crime();

CREATE OR REPLACE FUNCTION megaplanet.evaluate_shortlist_decision()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove any existing record to avoid dupes
  DELETE FROM megaplanet.customers_potential_pre_approved WHERE meg_id = NEW.meg_id;
  DELETE FROM megaplanet.customers_potential_rejected WHERE meg_id = NEW.meg_id;

  -- Logic: all 3 must be '0' to be approved
  IF NEW.meg_phone_legitimacy = '0'
     AND NEW.meg_financial_gross_eligible = '0'
     AND NEW.meg_financial_crime_cleared = '0' THEN

    INSERT INTO megaplanet.customers_potential_pre_approved (
      meg_id, meg_first_name, meg_last_name
    )
    VALUES (
      NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name
    );

  ELSE
    -- Anything else goes to rejected
    INSERT INTO megaplanet.customers_potential_rejected (
      meg_id, meg_first_name, meg_last_name
    )
    VALUES (
      NEW.meg_id, NEW.meg_first_name, NEW.meg_last_name
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_evaluate_shortlist_dynamic
AFTER INSERT OR UPDATE ON megaplanet.customers_potential_semi_shortlisted
FOR EACH ROW
EXECUTE FUNCTION megaplanet.evaluate_shortlist_decision();