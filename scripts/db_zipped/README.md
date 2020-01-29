## Instructions  
Execute .sql scripts in alphabetical order by filename. Filenames have number prefixes that indicate order.  

First, execute DDL using psql (**WARNING: THIS DDL SCRIPT DELETES THE EPP DATABASE, PATHWAY SCHEMA, AND EVERYTHING IN THE PATHWAY SCHEMA BEFORE REBUILDING IT**):  
`psql -h <hostname> -p <port> -U <username> -f <name of .sql file>`  

Example with actual filename:  
`psql -h localhost -p 5432 -U docker -f ./00_epp_prod_db_DDL.sql`  

Then execute insert statements in correct order with this command:  
```
(echo "BEGIN; \connect epp;";\
cat ./01_epp_pathway_training.sql;\
cat ./02_epp_pathway_training_occ.sql;\
cat ./03_epp_onet_job_zones.sql;\
cat ./04_epp_pathway_occ_ability.sql;\
cat ./06_epp_pathway_occ_skill.sql;\
cat ./07_epp_pathway_occupation.sql;\
cat ./08_epp_pathway_overlap.sql;\
cat ./09_epp_pathway_occ_educ_canada.sql;\
cat ./10_epp_pathway_alternate_titles.sql;\
echo "COMMIT;") \
 | psql -U docker -h localhost -p 5432 --quiet
 ```
 
 Note that file 08_... consists of over 1 million insert statements. It may take a while to run.  
 
 
 ### Fixes
 June 27, 2019: Execute `training_data_fix.sql` after running the above commands. This script will fix errors in
 the training data tables (`training` and `training_occ`).  
 June 28, 2019: Execute `has_distances_func_fix.sql` to alter the `update_socs_has_distances()` function so that it 
 correctly uses the dist_all_alt column instead of the dist_all column (which is not being used in the application).