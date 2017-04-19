TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`127.0.0.1` TRIGGER insert_table_open AFTER INSERT ON table_open FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "table_open" ,NEW.tableOpen_id, "insert" ); END' 'CREATE DEFINER=`root`@`127.0.0.1` TRIGGER update_table_open AFTER UPDATE ON table_open FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "table_open" ,NEW.tableOpen_id, "update" ); END'
sql_modes=1342177280 1342177280
definers='root@127.0.0.1' 'root@127.0.0.1'
