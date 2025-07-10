/*
This SQL file is intended for use with MySQL. 
Please note that the BAGONGPILIPINAS schema is not included in this version.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for schema-specific setup.
*/

--Ron Penones | July 10th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

insert into marriage_cert_check


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
('2024-3394','2024-05-05','mikha','lechon','2025-09-12','5839201','lucia','fyp','mamay','res','491728036','697801342','1999-03-06','2020-04-16');