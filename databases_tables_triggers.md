✅ Database Setup and Table Creation

To get started with the mock environment, execute the following steps to create the necessary databases and their respective tables. This setup is purely for demonstration purposes and is aimed at simulating various government checks relevant to a future condo loan application enhancement system.

1. Create the Main Database (the main databse should have the schema, the rest of the databases -not necessary)

CREATE DATABASE housing;

CREATE SCHEMA MEGAPLANET AUTHORIZATION 'USERNAME'

--mine is "create schema megaplanet authorization donnadb2"

SET CURRENT SCHEMA = megaplanet;


👉 Create table megaplanet.customers_potential


create table megaplanet.customers_potential (meg_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, meg_first_name VARCHAR(50) NOT NULL, meg_last_name VARCHAR(50) NOT NULL, meg_mail VARCHAR(100) NOT NULL, meg_phone VARCHAR(20) NOT NULL, meg_bir_tin_principal VARCHAR(20) NOT NULL, meg_bir_tin_married VARCHAR(20) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);

👉 CREATE TABLE megaplanet.CUSTOMERS_MOBILE with trigger

CREATE TABLE megaplanet.CUSTOMERS_MOBILE (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50) NOT NULL,
  MEG_LAST_NAME VARCHAR(50) NOT NULL,
  MEG_PHONE VARCHAR(20) NOT NULL,
  MEG_PHONE_LEGITIMACY SMALLINT CHECK (MEG_PHONE_LEGITIMACY IN (0,1))
);


ALTER TABLE megaplanet.CUSTOMERS_MOBILE
ALTER COLUMN MEG_PHONE_LEGITIMACY SET DEFAULT 1;


CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL
AFTER INSERT ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
  INSERT INTO megaplanet.CUSTOMERS_MOBILE (
    MEG_ID,
	MEG_FIRST_NAME,
    MEG_LAST_NAME,
    MEG_PHONE
  )
  VALUES (
    NEW_ROW.MEG_ID,     
NEW_ROW.MEG_FIRST_NAME,                                     
NEW_ROW.MEG_LAST_NAME,
NEW_ROW.MEG_PHONE
  );
END
@


CREATE TRIGGER TRG_AFTER_DELETE_CUSTOMERS_POTENTIAL
AFTER DELETE ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING OLD AS OLD_ROW
FOR EACH ROW
BEGIN ATOMIC
  DELETE FROM megaplanet.CUSTOMERS_MOBILE
  WHERE MEG_ID = OLD_ROW.MEG_ID;
END
@


/*
Make sure to execute this command using IBM Data studio because this will require you to set the statement terminator to '@' just for the purpose of applying this trigger.
This is only necessary if you are using IBM DB2 as your RDBMS, if you are not using IBM DB2 then you can stay with your default statement terminator.
BTW, setting the statement terminator in IBM Data studio is just right clicking in the SQL text editor, most likely 7th or 6th to the last row options.
Also, when creating trigger, right after the name of the trigger that you wish to create let us say you have ceated before CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL which means this trigger exist.
Make sure to create a new name that ressembles closely to the rest of other triggers just like CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
*/


👉 CREATE TABLE megaplanet.CUSTOMERS_TAX with trigger

CREATE TABLE megaplanet.CUSTOMERS_TAX (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50) NOT NULL,
  MEG_LAST_NAME VARCHAR(50) NOT NULL,
  MEG_BIR_TIN_PRINCIPAL VARCHAR(20) NOT NULL,
  MEG_BIR_TIN_MARRIED VARCHAR(20) NOT NULL,
  MEG_BIR_TIN_PRINCIPAL__GROSS_PHP_ELIGIBLE SMALLINT CHECK (MEG_BIR_TIN_PRINCIPAL__GROSS_PHP_ELIGIBLE IN (0,1)),
  MEG_BIR_TIN_MARRIED__GROSS_PHP_ELIGIBLE SMALLINT CHECK (MEG_BIR_TIN_MARRIED__GROSS_PHP_ELIGIBLE IN (0,1))
);

ALTER TABLE megaplanet.CUSTOMERS_TAX
ALTER COLUMN MEG_BIR_TIN_PRINCIPAL__GROSS_PHP_ELIGIBLE SET DEFAULT 1;

ALTER TABLE megaplanet.CUSTOMERS_TAX
ALTER COLUMN MEG_BIR_TIN_MARRIED__GROSS_PHP_ELIGIBLE SET DEFAULT 1;

CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
AFTER INSERT ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
  INSERT INTO megaplanet.CUSTOMERS_TAX (
    MEG_ID,
	MEG_FIRST_NAME,
    MEG_LAST_NAME,
    MEG_BIR_TIN_PRINCIPAL,
	MEG_BIR_TIN_MARRIED
	
  )
  VALUES (
    NEW_ROW.MEG_ID,     
NEW_ROW.MEG_FIRST_NAME,
NEW_ROW.MEG_LAST_NAME,                                    
NEW_ROW.MEG_BIR_TIN_PRINCIPAL,
NEW_ROW.MEG_BIR_TIN_MARRIED
  );
END
@


CREATE TRIGGER TRG_AFTER_DELETE_CUSTOMERS_POTENTIAL_TWO
AFTER DELETE ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING OLD AS OLD_ROW
FOR EACH ROW
BEGIN ATOMIC
  DELETE FROM megaplanet.CUSTOMERS_TAX
  WHERE MEG_ID = OLD_ROW.MEG_ID;
END
@

/*
Make sure to execute this command using IBM Data studio because this will require you to set the statement terminator to '@' just for the purpose of applying this trigger.
This is only necessary if you are using IBM DB2 as your RDBMS, if you are not using IBM DB2 then you can stay with your default statement terminator.
BTW, setting the statement terminator in IBM Data studio is just right clicking in the SQL text editor, most likely 7th or 6th to the last row options.
Also, when creating trigger, right after the name of the trigger that you wish to create let us say you have ceated before CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL which means this trigger exist.
Make sure to create a new name that ressembles closely to the rest of other triggers just like CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
*/


👉 CREATE TABLE megaplanet.CUSTOMERS_FINANCIAL_CRIME with trigger


CREATE TABLE megaplanet.CUSTOMERS_FINANCIAL_CRIME (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50) NOT NULL,
  MEG_LAST_NAME VARCHAR(50) NOT NULL,
  MEG_FIN_PRINCIPAL_CRIME_CLEAR SMALLINT CHECK (MEG_FIN_PRINCIPAL_CRIME_CLEAR IN (0,1)),
  MEG_FIN_MARRIED_CRIME_CLEAR SMALLINT CHECK (MEG_FIN_MARRIED_CRIME_CLEAR IN (0,1))
);



ALTER TABLE megaplanet.CUSTOMERS_FINANCIAL_CRIME
ALTER COLUMN MEG_FIN_PRINCIPAL_CRIME_CLEAR SET DEFAULT 1;

ALTER TABLE megaplanet.CUSTOMERS_FINANCIAL_CRIME
ALTER COLUMN MEG_FIN_MARRIED_CRIME_CLEAR SET DEFAULT 1;


CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_THREE
AFTER INSERT ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
  INSERT INTO megaplanet.CUSTOMERS_FINANCIAL_CRIME (
    MEG_ID,
	MEG_FIRST_NAME,
    MEG_LAST_NAME
	
  )
  VALUES (
    NEW_ROW.MEG_ID,     
NEW_ROW.MEG_FIRST_NAME,
NEW_ROW.MEG_LAST_NAME                                   
  );
END
@


CREATE TRIGGER TRG_AFTER_DELETE_CUSTOMERS_POTENTIAL_THREE
AFTER DELETE ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING OLD AS OLD_ROW
FOR EACH ROW
BEGIN ATOMIC
  DELETE FROM megaplanet.CUSTOMERS_FINANCIAL_CRIME
  WHERE MEG_ID = OLD_ROW.MEG_ID;
END
@


/*
Make sure to execute this command using IBM Data studio because this will require you to set the statement terminator to '@' just for the purpose of applying this trigger.
This is only necessary if you are using IBM DB2 as your RDBMS, if you are not using IBM DB2 then you can stay with your default statement terminator.
BTW, setting the statement terminator in IBM Data studio is just right clicking in the SQL text editor, most likely 7th or 6th to the last row options.
Also, when creating trigger, right after the name of the trigger that you wish to create let us say you have ceated before CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL which means this trigger exist.
Make sure to create a new name that ressembles closely to the rest of other triggers just like CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
*/


👉 CREATE TABLE megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED with trigger



CREATE TABLE megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50),
  MEG_LAST_NAME VARCHAR(50),
  MEG_PHONE VARCHAR (20),
  MEG_PHONE_LEGITIMACY VARCHAR (1),
 MEG_FINANCIAL_GROSS_ELIGIBLE VARCHAR (1),
MEG_FINANCIAL_CRIME_CLEARED VARCHAR (1)
);



CREATE OR REPLACE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_FOUR
AFTER INSERT ON megaplanet.CUSTOMERS_POTENTIAL
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
    INSERT INTO megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED (
        MEG_ID,
        MEG_FIRST_NAME,
        MEG_LAST_NAME,
        MEG_PHONE,
        MEG_PHONE_LEGITIMACY,
        MEG_FINANCIAL_GROSS_ELIGIBLE,
        MEG_FINANCIAL_CRIME_CLEARED
    )
    VALUES (
        NEW_ROW.MEG_ID,
        NEW_ROW.MEG_FIRST_NAME,
        NEW_ROW.MEG_LAST_NAME,
        NEW_ROW.MEG_PHONE,

        (SELECT MEG_PHONE_LEGITIMACY
         FROM megaplanet.CUSTOMERS_MOBILE
         WHERE MEG_ID = NEW_ROW.MEG_ID
         FETCH FIRST 1 ROW ONLY),

        (SELECT CASE 
                    WHEN MEG_BIR_TIN_PRINCIPAL__GROSS_PHP_ELIGIBLE = 0 
                      OR MEG_BIR_TIN_MARRIED__GROSS_PHP_ELIGIBLE = 0 
                    THEN 0 ELSE 1 
                END
         FROM megaplanet.CUSTOMERS_TAX
         WHERE MEG_ID = NEW_ROW.MEG_ID
         FETCH FIRST 1 ROW ONLY),

        (SELECT CASE 
                    WHEN MEG_FIN_PRINCIPAL_CRIME_CLEAR = 1 
                      OR MEG_FIN_MARRIED_CRIME_CLEAR = 1 
                    THEN 1 ELSE 0 
                END
         FROM megaplanet.CUSTOMERS_FINANCIAL_CRIME
         WHERE MEG_ID = NEW_ROW.MEG_ID
         FETCH FIRST 1 ROW ONLY)
    );
END
@


CREATE OR REPLACE TRIGGER TRG_UPDATE_FINANCIAL_CRIME_IMPACT
AFTER UPDATE ON megaplanet.CUSTOMERS_FINANCIAL_CRIME
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
    UPDATE megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED
    SET MEG_FINANCIAL_CRIME_CLEARED = 
        CASE 
            WHEN NEW_ROW.MEG_FIN_PRINCIPAL_CRIME_CLEAR = 1 
              OR NEW_ROW.MEG_FIN_MARRIED_CRIME_CLEAR = 1 
            THEN 1 ELSE 0 
        END
    WHERE MEG_ID = NEW_ROW.MEG_ID;
END
@

CREATE OR REPLACE TRIGGER TRG_UPDATE_TAX_IMPACT
AFTER UPDATE ON megaplanet.CUSTOMERS_TAX
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
    UPDATE megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED
    SET MEG_FINANCIAL_GROSS_ELIGIBLE = 
        CASE 
            WHEN NEW_ROW.MEG_BIR_TIN_PRINCIPAL__GROSS_PHP_ELIGIBLE = 0 
              OR NEW_ROW.MEG_BIR_TIN_MARRIED__GROSS_PHP_ELIGIBLE = 0 
            THEN 0 ELSE 1 
        END
    WHERE MEG_ID = NEW_ROW.MEG_ID;
END
@

CREATE OR REPLACE TRIGGER TRG_UPDATE_MOBILE_IMPACT
AFTER UPDATE ON megaplanet.CUSTOMERS_MOBILE
REFERENCING NEW AS NEW_ROW
FOR EACH ROW
BEGIN ATOMIC
    UPDATE megaplanet.CUSTOMERS_POTENTIAL_SEMI_SHORTLISTED
    SET MEG_PHONE_LEGITIMACY = NEW_ROW.MEG_PHONE_LEGITIMACY
    WHERE MEG_ID = NEW_ROW.MEG_ID;
END
@

/*
Make sure to execute this command using IBM Data studio because this will require you to set the statement terminator to '@' just for the purpose of applying this trigger.
This is only necessary if you are using IBM DB2 as your RDBMS, if you are not using IBM DB2 then you can stay with your default statement terminator.
BTW, setting the statement terminator in IBM Data studio is just right clicking in the SQL text editor, most likely 7th or 6th to the last row options.
Also, when creating trigger, right after the name of the trigger that you wish to create let us say you have ceated before CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL which means this trigger exist.
Make sure to create a new name that ressembles closely to the rest of other triggers just like CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
*/



👉 CREATE TABLE megaplanet.CUSTOMERS_POTENTIAL_REJECTED and megaplanet.CUSTOMERS_POTENTIAL_PRE_APPROVED with trigger

CREATE TABLE megaplanet.CUSTOMERS_POTENTIAL_REJECTED (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50),
  MEG_LAST_NAME VARCHAR(50)
);


CREATE TABLE megaplanet.CUSTOMERS_POTENTIAL_PRE_APPROVED (
  MEG_ID VARCHAR (5),
  MEG_FIRST_NAME VARCHAR(50),
  MEG_LAST_NAME VARCHAR(50)
);


CREATE TRIGGER megaplanet.trg_after_insert_semi_shortlisted
AFTER INSERT ON megaplanet.customers_potential_semi_shortlisted
REFERENCING NEW AS newrow
FOR EACH ROW
BEGIN ATOMIC

    DELETE FROM megaplanet.customers_potential_pre_approved WHERE meg_id = newrow.meg_id;
    DELETE FROM megaplanet.customers_potential_rejected WHERE meg_id = newrow.meg_id;

    IF newrow.meg_phone_legitimacy = 0 AND
       newrow.meg_financial_gross_eligible = 0 AND
       newrow.meg_financial_crime_cleared = 0 THEN

        INSERT INTO megaplanet.customers_potential_pre_approved (meg_id, meg_first_name, meg_last_name)
        VALUES (newrow.meg_id, newrow.meg_first_name, newrow.meg_last_name);

    ELSE

        INSERT INTO megaplanet.customers_potential_rejected (meg_id, meg_first_name, meg_last_name)
        VALUES (newrow.meg_id, newrow.meg_first_name, newrow.meg_last_name);

    END IF;

END
@


CREATE TRIGGER megaplanet.trg_after_update_semi_shortlisted
AFTER UPDATE ON megaplanet.customers_potential_semi_shortlisted
REFERENCING NEW AS newrow
FOR EACH ROW
BEGIN ATOMIC

    DELETE FROM megaplanet.customers_potential_pre_approved WHERE meg_id = newrow.meg_id;
    DELETE FROM megaplanet.customers_potential_rejected WHERE meg_id = newrow.meg_id;

    IF newrow.meg_phone_legitimacy = 0 AND
       newrow.meg_financial_gross_eligible = 0 AND
       newrow.meg_financial_crime_cleared = 0 THEN

        INSERT INTO megaplanet.customers_potential_pre_approved (meg_id, meg_first_name, meg_last_name)
        VALUES (newrow.meg_id, newrow.meg_first_name, newrow.meg_last_name);

    ELSE

        INSERT INTO megaplanet.customers_potential_rejected (meg_id, meg_first_name, meg_last_name)
        VALUES (newrow.meg_id, newrow.meg_first_name, newrow.meg_last_name);

    END IF;

END
@





/*
Make sure to execute this command using IBM Data studio because this will require you to set the statement terminator to '@' just for the purpose of applying this trigger.
This is only necessary if you are using IBM DB2 as your RDBMS, if you are not using IBM DB2 then you can stay with your default statement terminator.
BTW, setting the statement terminator in IBM Data studio is just right clicking in the SQL text editor, most likely 7th or 6th to the last row options.
Also, when creating trigger, right after the name of the trigger that you wish to create let us say you have ceated before CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL which means this trigger exist.
Make sure to create a new name that ressembles closely to the rest of other triggers just like CREATE TRIGGER TRG_AFTER_INSERT_CUSTOMERS_POTENTIAL_TWO
*/



2. Create the Tax Database (BIR)

CREATE DATABASE bir;

👉 Create table: bagongpilipinas.tax_background_check and populate


create table bagongpilipinas.tax_background_check (tax_identification_number VARCHAR(15) NOT NULL, tax_last_fiscal_gross_php DECIMAL(15,2) NOT NULL, tax_first_name VARCHAR(50) NOT NULL, tax_last_name VARCHAR(50) NOT NULL, tax_rdo VARCHAR(10) NOT NULL);


insert into bagongpilipinas.tax_background_check  (tax_identification_number, tax_last_fiscal_gross_php, tax_first_name, tax_last_name, tax_rdo)

values

('723412307','500000','juan','receipts','047'),
('088997190','400000','maria','ratio','049'),
('353387156','333000','jose','ship','052'),
('929507829','123456','ana','cancel','055'),
('992029891','918944.99','pedro','bussin','041'),
('614837205','996747.16','clara','sus','053'),
('781024639','229113.66','andres','zonk','058'),
('249573108','706100.28','teresa','mood','062'),
('506218937','166882.45','manuel','gg','043'),
('837490216','963672.96','lucia','pog','045'),
('190384726','580022.74','rafael','simp','048'),
('475619283','117793.75','isabel','fam','048'),
('832740591','456986.5','antonio','highkey','059'),
('610928374','716608.49','pilar','lowkey','060'),
('748392615','788760.18','francisco','goat','044'),
('293847560','151131.71','rosario','savage','061'),
('508162937','512551.85','miguel','lit','056'),
('719284305','590888.48','dolores','vibing','050'),
('384756192','559745.71','carlos','drip','054'),
('640281973','289082.8','magdalena','slaps','057'),
('859013472','879324.12','juan','hype','046'),
('374961820','324100.1','maria','cap','063'),
('561023497','286543.43','jose','snack','064'),
('927154860','959350.3','ana','woke','065'),
('108349572','665928.29','pedro','clout','066'),
('463728159','439415.39','magdalena','bop','067'),
('295174680','867591.55','bomby','finesse','068'),
('830912475','375304.99','clara','nocap','069'),
('710294836','773739.85','andres','sus','070'),
('549683210','415181.2','teresa','yeet','071'),
('387512904','528246.3','manuel','bet','072'),
('164920385','107058.68','lucia','vibe','072'),
('872603149','109025.65','rafael','glowup','073'),
('590274316','238552.66','isabel','flex','074'),
('721093845','233215.58','antonio','fyp','075'),
('384520179','734410.3','pilar','stan','076'),
('609237485','284260.66','francisco','mewing','077'),
('182746930','856618.34','rosario','sigma','078'),
('974813625','368625.76','miguel','skibidi','079'),
('256094831','534099.15','dolores','shook','080'),
('738402965','582683.86','carlos','clutch','081'),
('491027863','879324.12','magdalena','flexin','082'),
('683150294','324100.1','juan','cheugy','083'),
('359271086','950897.46','maria','glowup','084'),
('824670319','411442.94','jose','glow','085'),
('705819324','264680.22','ana','receipts','086'),
('291746035','774950.02','pedro','ratio','087'),
('617839205','531601.31','clara','ship','088'),
('804529371','567394.13','andres','cancel','089'),
('368920475','774543.67','teresa','bussin','090'),
('123784659','950897.46','carlos','sus','091'),
('589302761','411442.94','dolores','zonk','090'),
('470198236','264680.22','miguel','mood','089'),
('239715840','774950.02','rosario','gg','047'),
('675839104','531601.31','francisco','pog','049'),
('802164395','567394.13','pilar','simp','052'),
('174520983','774543.67','antonio','fam','055'),
('396847210','691415.67','isabel','highkey','041'),
('521073849','426012.97','rafael','lowkey','053'),
('763249510','957274.03','lucia','goat','058'),
('940318276','582683.86','manuel','savage','062'),
('218674350','534099.15','teresa','lit','043'),
('685019237','368625.76','andres','vibing','045'),
('407528196','856618.34','clara','drip','048'),
('135709824','284260.66','pedro','slaps','051'),
('927364518','734410.3','ana','hype','059'),
('314285970','233215.58','jose','cap','060'),
('689517023','238552.66','maria','snack','044'),
('752904318','109025.65','juan','woke','061'),
('450182763','107058.68','magdalena','clout','056'),
('603974128','528246.3','carlos','bop','050'),
('198736405','415181.2','dolores','finesse','054'),
('874320195','773739.85','miguel','nocap','057'),
('527410986','375304.99','rosario','sus','046'),
('361872490','867591.55','francisco','yeet','063'),
('249531087','439415.39','pilar','bet','064'),
('710689234','665928.29','antonio','vibe','065'),
('584329017','959350.3','isabel','glowup','066'),
('230467981','286543.43','rafael','flex','067'),
('697801342','324100.1','mamay','res','068'),
('814925730','879324.12','jayjay','cpl','069'),
('503168472','289082.8','titotito','lib','070'),
('129547680','559745.71','wengweng','cfg','071'),
('836019274','590888.48','kokoy','log','072'),
('472806139','512551.85','mimay','manifest','073'),
('305978142','151131.71','bitbit','scr','074'),
('681429537','788760.18','gagang','bak','075'),
('950172486','716608.49','buboy','drv','076'),
('274308619','456986.5','dongdong','dat','077'),
('543617908','117793.75','mommom','inf','078'),
('187024365','580022.74','chingching','ax','079'),
('462935871','963672.96','nanay','wim','080'),
('908547213','706100.28','dengdeng','ocx','081'),
('316089247','229113.66','dodong','vbs','082'),
('720354619','166882.45','tatat','com','083'),
('851962703','963672.96','lengleng','cab','084'),
('239480175','580022.74','tonton','tmp','085'),
('679025138','456986.5','jojo','reg','086'),
('124678930','415181.2','tintin','ini','087'),
('435107269','107058.68','junjun','sys','088'),
('789461023','918944.99','bebebeb','msi','091'),
('356982710','996747.16','makmak','bat','090'),
('510237864','229113.66','ronron','exe','089'),
('863519724','706100.28','nengneng','dll','088'),
('491728036','375304.99','lucia','fyp','087'),
('602374819','773739.85','manuel','stan','086'),
('173805462','528246.3','teresa','mewing','085'),
('748912630','107058.68','andres','sigma','084'),
('320547819','109025.65','clara','skibidi','083'),
('965183740','238552.66','pedro','shook','082'),
('258461703','950897.46','ana','clutch','081'),
('481395720','691415.67','jose','flexin','080'),
('607231948','286543.43','maria','cheugy','079'),
('139842765','439415.39','juan','glowup','078'),
('705618394','867591.55','magdalena','glow','077'),
('842079153','375304.99','carlos','receipts','076'),
('324697081','773739.85','dolores','ratio','075'),
('591028637','415181.2','miguel','ship','074'),
('163984275','528246.3','rosario','cancel','073'),
('874560239','107058.68','francisco','bussin','072'),
('420395861','109025.65','pilar','sus','071'),
('695817204','238552.66','antonio','zonk','070'),
('108237695','233215.58','isabel','mood','069'),
('367490512','734410.3','rafael','gg','066'),
('759063824','284260.66','lucia','pog','065'),
('483271069','856618.34','manuel','simp','064'),
('210394587','368625.76','teresa','fam','063'),
('692508731','534099.15','andres','highkey','046'),
('834120965','582683.86','clara','lowkey','057'),
('576398214','957274.03','jaljeera','history','054'),
('420987536','426012.97','barfi','man','050'),
('615230489','691415.67','gulab','sudo','056'),
('932857104','774543.67','lassi','chown','059'),
('180692473','567394.13','paratha','chmod','051'),
('247503869','531601.31','raita','diff','048'),
('804761295','774950.02','pedro','goat','045'),
('529074163','1000000','ana','savage','043'),
('365918720','264680.22','jose','lit','062'),
('718042639','411442.94','maria','vibing','058'),
('134769580','950897.46','juan','drip','053'),
('608473291','918944.99','magdalena','slaps','041'),
('957130284','700000.69','aeron','pogi','000'),
('382560197','900000.01','aira','tabachoy','001')

3. Create the DOJ Database

CREATE DATABASE doj;

👉 Create table: bagongpilipinas.financial_crime_check and populate


create table bagongpilipinas.financial_crime_check (crime_case_number VARCHAR (30) NOT NULL, crime_status VARCHAR (20) NOT NULL, crime_first_name VARCHAR (50) NOT NULL, crime_last_name VARCHAR (50) NOT NULL, crime_cedula_tin VARCHAR (15) NOT NULL, crime_law_code VARCHAR (30) NOT NULL, crime_court_branch VARCHAR (4) NOT NULL, crime_court_location VARCHAR (50) NOT NULL, crime_court_judge_first_name VARCHAR (50) NOT NULL, crime_court_judge_last_name VARCHAR (50) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)

insert into bagongpilipinas.financial_crime_check (CRIME_CASE_NUMBER,CRIME_STATUS,CRIME_FIRST_NAME,CRIME_LAST_NAME,CRIME_CEDULA_TIN,CRIME_LAW_CODE,CRIME_COURT_BRANCH,CRIME_COURT_LOCATION,CRIME_COURT_JUDGE_FIRST_NAME,CRIME_COURT_JUDGE_LAST_NAME)

values

('R-574-1998-044075-CR','Dismissed','juan','receipts','723412307','RA 9160','666','makati','angeli','tayuan'),
('R-583-2025-031026-CR','Acquitted','maria','ratio','088997190','BP 22','123','manila','ashley','maninilip'),
('R-993-1973-856366-CR','Open','jose','ship','353387156','RA 10175','456','mandaluyong','azi','eroticamanila'),
('R-684-2025-656834-CR','Retrial','ana','cancel','929507829','RA 9160','888','pateros','audrey','hugas'),
('R-642-1993-195577-CR','Convicted','pedro','bussin','992029891','RA 8424 ','1','zamboanga','aria','bedspacer'),
('R-857-2025-242886-CR','Dismissed','clara','sus','614837205','RA 10365 ','97','caloocan','aila','abotkamaynapangarap'),
('R-577-2025-328600-CR','Acquitted','andres','zonk','781024639','RA 9160','88','pasig','alessandra','tokyonights'),
('R-304-2025-703634-CR','Open','teresa','mood','249573108','BP 22','13','makati','apple','baligtaran'),
('R-704-2025-005606-CR','Retrial','manuel','gg','506218937','RA 10175','11','manila','aiko','baliktaya'),
('R-837-2025-962129-CR','Convicted','lucia','pog','837490216','RA 9160','666','mandaluyong','andrea','sandwich'),
('R-966-2025-513796-CR','Dismissed','rafael','simp','190384726','RA 8424 ','123','pateros','angeli','tayuan'),
('R-569-2015-125675-CR','Acquitted','isabel','fam','475619283','RA 10365 ','456','zamboanga','ashley','maninilip'),
('R-914-1971-587624-CR','Open','antonio','highkey','832740591','RA 9160','888','caloocan','azi','eroticamanila'),
('R-438-2019-384224-CR','Retrial','pilar','lowkey','610928374','BP 22','1','pasig','audrey','hugas'),
('R-492-1983-489771-CR','Convicted','francisco','goat','748392615','RA 10175','97','makati','aria','bedspacer'),
('R-925-2025-479983-CR','Dismissed','rosario','savage','293847560','RA 9160','88','manila','aila','abotkamaynapangarap'),
('R-524-2025-305287-CR','Acquitted','miguel','lit','508162937','RA 8424 ','13','mandaluyong','alessandra','tokyonights'),
('R-368-1999-770007-CR','Open','dolores','vibing','719284305','RA 10365 ','11','pateros','apple','baligtaran'),
('R-862-2025-190565-CR','Retrial','carlos','drip','384756192','RA 9160','666','zamboanga','aiko','baliktaya'),
('R-253-2018-652201-CR','Convicted','magdalena','slaps','640281973','BP 22','123','caloocan','andrea','sandwich'),
('R-871-2025-985086-CR','Dismissed','juan','hype','859013472','RA 10175','456','pasig','angeli','tayuan'),
('R-957-2009-415357-CR','Acquitted','maria','cap','374961820','RA 9160','888','pasig','ashley','maninilip'),
('R-865-1996-013542-CR','Open','jose','snack','561023497','RA 8424 ','1','pasig','azi','eroticamanila'),
('R-497-2003-582013-CR','Retrial','ana','woke','927154860','RA 10365 ','97','pasig','audrey','hugas'),
('R-804-2025-680538-CR','Convicted','pedro','clout','108349572','RA 9160','88','pasig','aria','bedspacer'),
('R-989-1990-680105-CR','Dismissed','magdalena','bop','463728159','BP 22','13','pasig','aila','abotkamaynapangarap'),
('R-669-2010-151080-CR','Acquitted','bomby','finesse','295174680','RA 10175','11','pasig','alessandra','tokyonights'),
('R-979-2017-953976-CR','Open','clara','nocap','830912475','RA 9160','666','pasig','apple','baligtaran'),
('R-897-1999-568831-CR','Retrial','andres','sus','710294836','RA 8424 ','123','pasig','aiko','baliktaya'),
('R-926-1984-178504-CR','Convicted','teresa','yeet','549683210','RA 10365 ','456','pasig','andrea','sandwich'),
('R-108-1972-857167-CR','Dismissed','manuel','bet','387512904','RA 9160','888','pasig','angeli','tayuan'),
('R-595-2003-263065-CR','Acquitted','lucia','vibe','164920385','BP 22','1','pasig','ashley','maninilip'),
('R-152-2025-322426-CR','Open','rafael','glowup','872603149','RA 10175','97','pasig','azi','eroticamanila'),
('R-543-2025-393687-CR','Retrial','isabel','flex','590274316','RA 9160','88','pasig','audrey','hugas'),
('R-585-1995-586851-CR','Convicted','antonio','fyp','721093845','RA 8424 ','13','pasig','aria','bedspacer'),
('R-651-2006-750409-CR','Dismissed','pilar','stan','384520179','RA 10365 ','11','pasig','aila','abotkamaynapangarap'),
('R-260-1992-866157-CR','Acquitted','francisco','mewing','609237485','RA 9160','666','mandaluyong','alessandra','tokyonights'),
('R-379-1976-212152-CR','Open','rosario','sigma','182746930','BP 22','123','mandaluyong','apple','baligtaran'),
('R-256-2010-826394-CR','Retrial','miguel','skibidi','974813625','RA 10175','456','mandaluyong','aiko','baliktaya'),
('R-644-2025-990562-CR','Convicted','dolores','shook','256094831','RA 9160','888','mandaluyong','andrea','sandwich'),
('R-645-1998-532848-CR','Dismissed','carlos','clutch','738402965','RA 8424 ','1','mandaluyong','angeli','tayuan'),
('R-334-2025-444279-CR','Acquitted','magdalena','flexin','491027863','RA 10365 ','97','mandaluyong','ashley','maninilip'),
('R-759-2024-971009-CR','Open','juan','cheugy','683150294','RA 9160','88','mandaluyong','azi','eroticamanila'),
('R-943-1971-534364-CR','Retrial','maria','glowup','359271086','BP 22','13','mandaluyong','audrey','hugas'),
('R-209-1972-806867-CR','Convicted','jose','glow','824670319','RA 10175','11','mandaluyong','aria','bedspacer'),
('R-932-1999-983165-CR','Dismissed','ana','receipts','705819324','RA 9160','11','mandaluyong','aila','abotkamaynapangarap'),
('R-853-2025-257556-CR','Acquitted','pedro','ratio','291746035','RA 8424 ','11','mandaluyong','alessandra','tokyonights'),
('R-138-1976-889912-CR','Open','clara','ship','617839205','RA 10365 ','11','makati','apple','baligtaran'),
('R-902-2025-585230-CR','Retrial','andres','cancel','804529371','RA 9160','11','manila','aiko','baliktaya'),
('R-119-2025-759063-CR','Convicted','teresa','bussin','368920475','BP 22','11','mandaluyong','andrea','sandwich'),
('R-209-1993-717257-CR','Dismissed','carlos','sus','123784659','RA 10175','11','pateros','angeli','tayuan'),
('R-311-1992-445218-CR','Dismissed','dolores','zonk','589302761','RA 9160','11','zamboanga','ashley','maninilip'),
('R-678-1988-403161-CR','Dismissed','miguel','mood','470198236','RA 8424 ','11','caloocan','azi','eroticamanila'),
('R-187-2020-953195-CR','Dismissed','rosario','gg','239715840','RA 10365 ','11','pasig','audrey','hugas'),
('R-983-2007-042466-CR','Dismissed','francisco','pog','675839104','RA 10365 ','11','makati','aria','bedspacer'),
('R-834-2025-327402-CR','Dismissed','pilar','simp','802164395','RA 10365 ','11','manila','aila','abotkamaynapangarap'),
('R-560-2025-382909-CR','Dismissed','antonio','fam','174520983','RA 10365 ','11','mandaluyong','alessandra','tokyonights'),
('R-860-1976-545682-CR','Dismissed','isabel','highkey','396847210','RA 10365 ','11','pateros','apple','baligtaran'),
('R-847-2002-295025-CR','Dismissed','rafael','lowkey','521073849','RA 10365','11','zamboanga','aiko','baliktaya'),
('R-508-2025-309828-CR','Dismissed','lucia','goat','763249510','BP 22','11','caloocan','andrea','sandwich'),
('R-382-2025-607065-CR','Dismissed','manuel','savage','940318276','BP 22','888','makati','angeli','tayuan'),
('R-838-2004-869465-CR','Dismissed','teresa','lit','218674350','BP 22','888','manila','ashley','maninilip'),
('R-239-2025-907097-CR','Dismissed','andres','vibing','685019237','BP 22','888','mandaluyong','azi','eroticamanila'),
('R-162-2025-029934-CR','Dismissed','clara','drip','407528196','BP 22','888','pateros','audrey','hugas'),
('R-180-2020-475053-CR','Dismissed','pedro','slaps','135709824','BP 22','888','zamboanga','aria','bedspacer'),
('R-748-1971-243104-CR','Dismissed','ana','hype','927364518','BP 22','888','caloocan','aila','abotkamaynapangarap'),
('R-467-2024-184034-CR','Dismissed','jose','cap','314285970','BP 22','888','pasig','alessandra','tokyonights'),
('R-881-2025-402417-CR','Dismissed','maria','snack','689517023','BP 22','888','makati','apple','baligtaran'),
('R-502-2014-737498-CR','Dismissed','juan','woke','752904318','BP 22','888','manila','aiko','baliktaya'),
('R-308-2025-201125-CR','Dismissed','magdalena','clout','450182763','BP 22','13','mandaluyong','andrea','sandwich'),
('R-922-2016-133569-CR','Dismissed','carlos','bop','603974128','BP 22','13','pateros','angeli','tayuan'),
('R-979-1974-628716-CR','Dismissed','dolores','finesse','198736405','BP 22','13','zamboanga','ashley','maninilip')


4. Create the PSA Database

CREATE DATABASE psa;

👉 Create Table: bagongpilipinas.marriage_cert_check and populate

create table bagongpilipinas.marriage_cert_check (mar_registry_number VARCHAR(10) NOT NULL, mar_date DATE NOT NULL, mar_solemnizing_officer_first_name VARCHAR(50) NOT NULL, mar_solemnizing_officer_last_name VARCHAR(50) NOT NULL, 
mar_solemnizing_officer_license_expiry DATE NOT NULL, mar_solemnizing_officer_license_number VARCHAR(10) NOT NULL, mar_husband_first_name VARCHAR(50) NOT NULL, mar_husband_last_name VARCHAR(50) NOT NULL,
mar_wife_first_name VARCHAR(50) NOT NULL, mar_wife_last_name VARCHAR(50) NOT NULL, mar_cedula_tin_husband VARCHAR(15) NOT NULL, mar_cedula_tin_wife VARCHAR(15) NOT NULL, mar_husband_dob DATE NOT NULL, mar_wife_dob DATE NOT NULL);

insert into bagongpilipinas.marriage_cert_check


(MAR_REGISTRY_NUMBER,
MAR_DATE,
MAR_SOLEMNIZING_OFFICER_FIRST_NAME,
MAR_SOLEMNIZING_OFFICER_LAST_NAME,
MAR_SOLEMNIZING_OFFICER_LICENSE_EXPIRY,
MAR_SOLEMNIZING_OFFICER_LICENSE_NUMBER,
MAR_HUSBAND_FIRST_NAME,
MAR_HUSBAND_LAST_NAME,
MAR_WIFE_FIRST_NAME,
MAR_WIFE_LAST_NAME,
MAR_CEDULA_TIN_HUSBAND,
MAR_CEDULA_TIN_WIFE,
MAR_HUSBAND_DOB,
MAR_WIFE_DOB)

values


('1997-4821','1997-07-15','mikha','lechon','2008-04-16','5839201','clara','lowkey','nengneng','dll','834120965','863519724','1973-11-16','1980-08-23'),
('1998-7105','1998-02-18','jhoanna','caldereta','2008-11-02','7194306','andres','highkey','ronron','exe','692508731','510237864','1977-07-29','1976-04-01'),
('2000-2569','2000-06-02','sheena','pakbet','2008-01-27','2648759','teresa','fam','makmak','bat','210394587','356982710','1968-03-03','1971-11-11'),
('2001-3590','2001-03-08','aiah','saging','2008-07-11','8073614','manuel','simp','bebebeb','msi','483271069','789461023','1970-05-21','1969-02-18'),
('2002-6083','2002-11-10','gwen','karekare','2008-02-22','4352098','lucia','pog','junjun','sys','837490216','435107269','1979-02-10','1975-09-25'),
('2003-7812','2003-09-12','colet','inasal','2008-10-09','6901573','rafael','gg','tintin','ini','367490512','124678930','1969-12-27','1967-12-20'),
('2004-1472','2004-08-08','maloi','dinuguan','2008-05-30','1529847','isabel','mood','jojo','reg','108237695','679025138','1974-09-05','1979-10-03'),
('2005-1623','2005-01-22','stacey','turon','2008-12-18','3786402','antonio','zonk','tonton','tmp','695817204','239480175','1971-08-13','1973-05-09'),
('2006-9850','2006-04-17','mikha','lechon','2008-08-05','5839201','pilar','sus','lengleng','cab','420395861','851962703','1967-06-08','1970-07-27'),
('2007-4901','2007-10-03','jhoanna','caldereta','2024-08-20','7194306','francisco','bussin','tatat','com','874560239','720354619','1976-10-19','1968-01-14'),
('2008-4933','2008-03-03','sheena','pakbet','2024-03-01','2648759','rosario','cancel','dodong','vbs','163984275','316089247','1972-01-02','1974-06-06'),
('2009-3348','2009-02-27','aiah','saging','2024-09-22','8073614','miguel','ship','dengdeng','ocx','591028637','908547213','1966-04-24','1966-03-30'),
('2010-8723','2010-08-30','gwen','karekare','2024-06-30','4352098','dolores','ratio','nanay','wim','324697081','462935871','1978-11-30','1977-08-22'),
('2012-1937','2012-06-11','colet','inasal','2024-01-05','6901573','carlos','receipts','chingching','ax','842079153','187024365','1970-03-17','1972-11-08'),
('2014-6281','2014-12-05','maloi','dinuguan','2024-04-09','1529847','magdalena','glow','mommom','inf','705618394','543617908','1969-07-09','1978-04-19'),
('2015-2409','2015-05-19','stacey','turon','2024-10-13','3786402','juan','glowup','dongdong','dat','139842765','274308619','1975-02-22','1969-12-01'),
('2016-9004','2016-04-01','mikha','lechon','2024-07-28','5839201','maria','cheugy','buboy','drv','607231948','950172486','1971-12-14','1975-09-16'),
('2017-1178','2017-11-23','jhoanna','caldereta','2024-02-03','7194306','jose','flexin','gagang','bak','481395720','681429537','1974-08-07','1971-02-05'),
('2018-7640','2018-03-14','sheena','pakbet','2024-08-09','2648759','ana','clutch','bitbit','scr','258461703','305978142','1967-05-26','1967-06-29'),
('2019-5532','2019-10-20','aiah','saging','2024-11-05','8073614','pedro','shook','mimay','manifest','965183740','472806139','1979-09-04','1973-10-13'),
('2020-8316','2020-07-07','gwen','karekare','2024-03-18','4352098','clara','skibidi','kokoy','log','320547819','836019274','1966-10-31','1966-07-24'),
('2021-7455','2021-09-09','colet','inasal','2024-12-11','6901573','andres','sigma','wengweng','cfg','748912630','129547680','1973-06-15','1979-05-11'),
('2022-2098','2022-06-25','maloi','dinuguan','2024-05-23','1529847','teresa','mewing','titotito','lib','173805462','503168472','1978-01-28','1974-01-20'),
('2023-6710','2023-12-13','stacey','turon','2025-04-27','3786402','manuel','stan','jayjay','cpl','602374819','814925730','1972-07-12','1976-08-04'),
('2024-3394','2024-05-05','mikha','lechon','2025-09-12','5839201','lucia','fyp','mamay','res','491728036','697801342','1999-03-06','2020-04-16')

3. Create the ntc Database

CREATE DATABASE ntc;

👉 Create Table: bagongpilipinas.mobile_sim_registration and populate


create table bagongpilipinas.mobile_sim_registration (mobile_sim_number VARCHAR (11) NOT NULL, mobile_sim_first_name VARCHAR (50) NOT NULL, mobile_sim_last_name VARCHAR (50) NOT NULL, mobile_sim__most_recent_carrier VARCHAR (5) NOT NULL, mobile_sim__most_recent_routing_category VARCHAR (8) NOT NULL)

insert into bagongpilipinas.mobile_sim_registration

(MOBILE_SIM_NUMBER,MOBILE_SIM_FIRST_NAME,MOBILE_SIM_LAST_NAME,MOBILE_SIM__MOST_RECENT_CARRIER,MOBILE_SIM__MOST_RECENT_ROUTING_CATEGORY)

values

('9006661159','juan','receipts','globe','prepaid'),
('9006664719','maria','ratio','smart','postpaid'),
('9006660500','jose','ship','dito','prepaid'),
('9006667250','ana','cancel','globe','postpaid'),
('9006667906','pedro','bussin','smart','prepaid'),
('9006669487','clara','sus','dito','postpaid'),
('9006662818','andres','zonk','globe','prepaid'),
('9006665306','teresa','mood','smart','postpaid'),
('9006662349','manuel','gg','dito','prepaid'),
('9006668153','lucia','pog','globe','postpaid'),
('9006667349','rafael','simp','smart','prepaid'),
('9006669202','isabel','fam','dito','postpaid'),
('9006662452','antonio','highkey','globe','prepaid'),
('9006664963','pilar','lowkey','smart','postpaid'),
('9006664048','francisco','goat','dito','prepaid'),
('9006664654','rosario','savage','globe','postpaid'),
('9006666148','miguel','lit','smart','prepaid'),
('9006660425','dolores','vibing','dito','postpaid'),
('9006668939','carlos','drip','globe','prepaid'),
('9006668797','magdalena','slaps','smart','postpaid'),
('9006665421','juan','hype','dito','prepaid'),
('9006662162','maria','cap','globe','postpaid'),
('9006661814','jose','snack','smart','prepaid'),
('9006664658','ana','woke','dito','postpaid'),
('9006669168','pedro','clout','globe','prepaid'),
('9006667127','magdalena','bop','smart','postpaid'),
('9006668080','bomby','finesse','dito','prepaid'),
('9006664759','clara','nocap','globe','postpaid'),
('9006662584','andres','sus','smart','prepaid'),
('9006669946','teresa','yeet','dito','postpaid'),
('9006660780','manuel','bet','globe','prepaid'),
('9006668777','lucia','vibe','smart','postpaid'),
('9006663548','rafael','glowup','dito','prepaid'),
('9006668324','isabel','flex','globe','postpaid'),
('9006660530','antonio','fyp','smart','prepaid'),
('9006668615','pilar','stan','dito','postpaid'),
('9006669834','francisco','mewing','globe','prepaid'),
('9006660063','rosario','sigma','smart','postpaid'),
('9006666248','miguel','skibidi','dito','prepaid'),
('9006668804','dolores','shook','globe','postpaid'),
('9006665722','carlos','clutch','smart','prepaid'),
('9006668708','magdalena','flexin','dito','postpaid'),
('9006663078','juan','cheugy','globe','prepaid'),
('9006662149','maria','glowup','smart','postpaid'),
('9006664935','jose','glow','dito','prepaid'),
('9006661011','ana','receipts','globe','postpaid'),
('9006667880','pedro','ratio','smart','prepaid'),
('9006664230','clara','ship','dito','postpaid'),
('9006668962','andres','cancel','globe','prepaid'),
('9006664215','teresa','bussin','smart','postpaid'),
('9006666554','carlos','sus','dito','prepaid'),
('9006661218','dolores','zonk','globe','postpaid'),
('9006661371','miguel','mood','smart','prepaid'),
('9006668303','rosario','gg','dito','postpaid'),
('9006669295','francisco','pog','globe','prepaid'),
('9006661957','pilar','simp','smart','postpaid'),
('9006669178','antonio','fam','dito','prepaid'),
('9006660830','isabel','highkey','globe','postpaid'),
('9006667385','rafael','lowkey','smart','prepaid'),
('9006668928','lucia','goat','dito','postpaid'),
('9006663289','manuel','savage','globe','prepaid'),
('9006663599','teresa','lit','smart','postpaid'),
('9006663673','andres','vibing','dito','prepaid'),
('9006661983','clara','drip','globe','postpaid'),
('9006667076','pedro','slaps','smart','prepaid'),
('9006669039','ana','hype','dito','postpaid'),
('9006669109','jose','cap','globe','prepaid'),
('9006667122','maria','snack','smart','postpaid'),
('9006662511','juan','woke','dito','prepaid'),
('9006667530','magdalena','clout','globe','postpaid'),
('9006665761','carlos','bop','smart','prepaid'),
('9006669568','dolores','finesse','dito','postpaid'),
('9006669357','miguel','nocap','globe','prepaid'),
('9006666083','rosario','sus','smart','postpaid'),
('9006667816','francisco','yeet','dito','prepaid'),
('9006663173','pilar','bet','globe','postpaid'),
('9006664258','antonio','vibe','smart','prepaid'),
('9006666471','isabel','glowup','dito','postpaid'),
('9006668670','rafael','flex','globe','prepaid'),
('9006665858','mamay','res','smart','postpaid'),
('9006660605','jayjay','cpl','dito','prepaid'),
('9006669348','titotito','lib','globe','postpaid'),
('9006667620','wengweng','cfg','smart','prepaid'),
('9006661751','kokoy','log','dito','postpaid'),
('9006662128','mimay','manifest','globe','prepaid'),
('9006667243','bitbit','scr','smart','postpaid'),
('9006661998','gagang','bak','dito','prepaid'),
('9006661255','buboy','drv','globe','postpaid'),
('9006660591','dongdong','dat','smart','prepaid'),
('9006660206','mommom','inf','dito','postpaid'),
('9006660447','chingching','ax','globe','prepaid'),
('9006661071','nanay','wim','smart','postpaid'),
('9006666626','dengdeng','ocx','dito','prepaid'),
('9006667338','dodong','vbs','globe','postpaid'),
('9006661212','tatat','com','smart','prepaid'),
('9006661365','lengleng','cab','dito','postpaid'),
('9006662938','tonton','tmp','globe','prepaid'),
('9006668009','jojo','reg','smart','postpaid'),
('9006667601','tintin','ini','dito','prepaid'),
('9006667146','junjun','sys','globe','postpaid'),
('9006669169','bebebeb','msi','smart','prepaid'),
('9006661181','makmak','bat','dito','postpaid'),
('9006660322','ronron','exe','globe','postpaid'),
('9006666654','nengneng','dll','smart','prepaid'),
('9006663663','lucia','fyp','dito','postpaid'),
('9006665707','manuel','stan','globe','prepaid'),
('9006668592','teresa','mewing','smart','postpaid'),
('9006660528','andres','sigma','dito','prepaid'),
('9006667903','clara','skibidi','globe','postpaid'),
('9006663046','pedro','shook','smart','prepaid'),
('9006664135','ana','clutch','dito','postpaid'),
('9006662002','jose','flexin','globe','prepaid'),
('9006660727','maria','cheugy','smart','postpaid'),
('9006660935','juan','glowup','dito','postpaid'),
('9006662656','magdalena','glow','globe','prepaid'),
('9006664334','carlos','receipts','smart','postpaid'),
('9006669896','dolores','ratio','dito','prepaid'),
('9006663518','miguel','ship','globe','postpaid'),
('9006666203','rosario','cancel','smart','prepaid'),
('9006663933','francisco','bussin','dito','postpaid'),
('9006666792','pilar','sus','globe','prepaid'),
('9006661582','antonio','zonk','smart','postpaid'),
('9006669987','isabel','mood','dito','prepaid'),
('9006661513','rafael','gg','dito','postpaid'),
('9006669701','lucia','pog','globe','postpaid'),
('9006667275','manuel','simp','smart','prepaid'),
('9006661784','teresa','fam','dito','postpaid'),
('9006668902','andres','highkey','globe','prepaid'),
('9006669693','clara','lowkey','smart','postpaid'),
('9006661976','jaljeera','history','dito','prepaid'),
('9006668105','barfi','man','globe','postpaid'),
('9006666945','gulab','sudo','smart','prepaid'),
('9006668611','lassi','chown','dito','postpaid'),
('9006665479','paratha','chmod','globe','prepaid'),
('9006665211','raita','diff','smart','postpaid'),
('9006660661','pedro','goat','dito','postpaid'),
('9006669087','ana','savage','globe','prepaid'),
('9006662646','jose','lit','smart','postpaid'),
('9006668402','maria','vibing','dito','prepaid'),
('9006669523','juan','drip','dito','postpaid'),
('9006664721','magdalena','slaps','globe','prepaid'),
('9006667541','aeron','pogi','smart','postpaid'),
('9006664100','aira','tabachoy','dito','prepaid'),
('9006662614','inday','garutay','globe','postpaid')

📝Populating the Mock Databases

Once all mock government databases are ready, feel free to populate them with sample data entries. This will help simulate realistic test scenarios.

The current sample database uses IBM DB2 as its RDBMS and you are free to adapt or convert it to suit your platform of choice i.e. PostgreSQL, MySQL. Please use fictional names, birthdates, tax IDs, and other sample details. Avoid using real data — the purpose of this project is just to illustrate potential enhancements in processing PH - condo loan applications.