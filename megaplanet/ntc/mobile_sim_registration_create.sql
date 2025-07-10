/*
This SQL file is intended for use with MySQL. 
Please note that the BAGONGPILIPINAS schema is not included in this version.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for schema-specific setup.
*/

--Ron Penones | July 10th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

create table mobile_sim_registration (mobile_sim_number VARCHAR (11) not null,
mobile_sim_first_name VARCHAR (50) not null,
mobile_sim_last_name VARCHAR (50) not null,
mobile_sim__most_recent_carrier VARCHAR (5) not null,
mobile_sim__most_recent_routing_category VARCHAR (8) not null)