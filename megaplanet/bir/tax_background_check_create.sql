/*
This SQL file is intended for use with MySQL. 
Please note that the BAGONGPILIPINAS schema is not included in this version.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for schema-specific setup.
*/

/*
Ron Penones | July 8th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!
*/

create table tax_background_check (tax_identification_number VARCHAR(15) not null,
tax_last_fiscal_gross_php DECIMAL(15, 2) not null,
tax_first_name VARCHAR(50) not null,
tax_last_name VARCHAR(50) not null,
tax_rdo VARCHAR(10) not null);
