/*
This SQL file is intended for use with MySQL. 
Please note that the BAGONGPILIPINAS schema is not included in this version.
If you are using IBM DB2 instead, refer to the 'databases_tables_triggers.md' in the repository for schema-specific setup.
*/

--Ron Penones | July 10th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!


CREATE TABLE financial_crime_check (
  crime_case_number VARCHAR(30) NOT NULL,
  crime_status VARCHAR(20) NOT NULL,
  crime_first_name VARCHAR(50) NOT NULL,
  crime_last_name VARCHAR(50) NOT NULL,
  crime_cedula_tin VARCHAR(15) NOT NULL,
  crime_law_code VARCHAR(30) NOT NULL,
  crime_court_branch VARCHAR(4) NOT NULL,
  crime_court_location VARCHAR(50) NOT NULL,
  crime_court_judge_first_name VARCHAR(50) NOT NULL,
  crime_court_judge_last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);