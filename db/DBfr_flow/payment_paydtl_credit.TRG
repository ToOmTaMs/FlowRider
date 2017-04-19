TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`127.0.0.1` TRIGGER insert_payment_paydtl_credit AFTER INSERT ON payment_paydtl_credit FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "payment_paydtl_credit" ,NEW.id, "insert" ); END' 'CREATE DEFINER=`root`@`127.0.0.1` TRIGGER update_payment_paydtl_credit AFTER UPDATE ON payment_paydtl_credit FOR EACH ROW BEGIN INSERT INTO a_sync_data (d_create, location_id, c_tab_name, i_row_id, c_type ) VALUES (CURRENT_TIMESTAMP, "1002", "payment_paydtl_credit" ,NEW.id, "update" ); END'
sql_modes=1342177280 1342177280
definers='root@127.0.0.1' 'root@127.0.0.1'
