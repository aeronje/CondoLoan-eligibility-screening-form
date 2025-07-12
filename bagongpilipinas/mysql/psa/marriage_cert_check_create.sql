/*
This SQL file is intended for use with MySQL. 
Please note that the BAGONGPILIPINAS schema is not included in this version.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for schema-specific setup.
*/

/*
Ron Penones | July 10th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!
*/

create table marriage_cert_check (mar_registry_number VARCHAR(10) not null,
mar_date DATE not null,
mar_solemnizing_officer_first_name VARCHAR(50) not null,
mar_solemnizing_officer_last_name VARCHAR(50) not null, 
mar_solemnizing_officer_license_expiry DATE not null,
mar_solemnizing_officer_license_number VARCHAR(10) not null,
mar_husband_first_name VARCHAR(50) not null,
mar_husband_last_name VARCHAR(50) not null,
mar_wife_first_name VARCHAR(50) not null,
mar_wife_last_name VARCHAR(50) not null,
mar_cedula_tin_husband VARCHAR(15) not null,
mar_cedula_tin_wife VARCHAR(15) not null,
mar_husband_dob DATE not null,
mar_wife_dob DATE not null);