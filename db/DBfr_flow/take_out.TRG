TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`127.0.0.1` TRIGGER insert_take_out AFTER INSERT ON take_out FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "take_out" ,NEW.takeOut_id, "insert" ); END' 'CREATE DEFINER=`root`@`127.0.0.1` TRIGGER update_take_out AFTER UPDATE ON take_out FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "take_out" ,NEW.takeOut_id, "update" ); END'
sql_modes=1342177280 1342177280
definers='root@127.0.0.1' 'root@127.0.0.1'
