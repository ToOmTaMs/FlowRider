
#2017-04-16
-- ----------------------------
-- Table structure for `lanes`
-- ----------------------------
DROP TABLE IF EXISTS `lanes`;
CREATE TABLE `lanes` (
  `lane_id` int(11) unsigned NOT NULL auto_increment,
  `lng1_c_name` varchar(255) NOT NULL default '',
  `lng2_c_name` varchar(255) NOT NULL default '',
  `lng3_c_name` varchar(255) NOT NULL default '',
  `e_status` enum('normal','cancel') NOT NULL default 'normal',
  `i_user` int(11) NOT NULL default '0',
  `c_seq` int(11) NOT NULL default '0',
  `d_create` datetime NOT NULL default '0000-00-00 00:00:00',
  `d_update` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`lane_id`)
) ENGINE=MyISAM   DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lanes
-- ----------------------------
INSERT INTO `lanes` VALUES ('1', 'lane1', '', '', 'normal', '10', '1', now(), now());
INSERT INTO `lanes` VALUES ('2', 'lane2', '', '', 'normal', '10', '2', now(), now());
INSERT INTO `lanes` VALUES ('3', 'lane3', '', '', 'normal', '10', '3', now(), now());


DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent` (
  `agent_id` int(11) unsigned NOT NULL auto_increment,
  `lng1_c_name` varchar(255) NOT NULL default '',
  `lng2_c_name` varchar(255) NOT NULL default '',
  `lng3_c_name` varchar(255) NOT NULL default '',
  `e_status` enum('normal','cancel') NOT NULL default 'normal',
  `c_mobile` varchar(100) NOT NULL default '',
  `i_price` double NOT NULL default '0',
  `i_hour` int(11) NOT NULL default '0',
  `i_month` int(11) NOT NULL default '0',
  `c_seq` int(11) NOT NULL default '0',
  `d_create` datetime NOT NULL default '0000-00-00 00:00:00',
  `d_update` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`agent_id`)
) ENGINE=MyISAM   DEFAULT CHARSET=utf8;



#2017-04-20
# insert into conf (c_name,c_value,remark) values ('jasperreports_report_folder','flow_report','folder สำหรับ report');
# insert into conf (c_name,c_value,remark) values ('jasperreports_report_folder','flow_report','folder สำหรับ report');
# insert into conf (c_name,c_value,remark) values ('jasperreports_report_folder','flow_report','folder สำหรับ report');


insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_restaurant_main_logo',c_value,lng1,lng2,lng3 from conf where c_name='restaurant_main_logo';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_restaurant_logo',c_value,lng1,lng2,lng3 from conf where c_name='restaurant_logo';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_restaurant_name',c_value,lng1,lng2,lng3 from conf where c_name='restaurant_name';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_TAX_ID',c_value,lng1,lng2,lng3 from conf where c_name='TAX_ID';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_receipt_line1',c_value,lng1,lng2,lng3 from conf where c_name='receipt_line1';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_receipt_line2',c_value,lng1,lng2,lng3 from conf where c_name='receipt_line2';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_receipt_line3',c_value,lng1,lng2,lng3 from conf where c_name='receipt_line3';
insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_receipt_footer',c_value,lng1,lng2,lng3 from conf where c_name='receipt_footer';


# insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_receipt_promotion_line',c_value,lng1,lng2,lng3 from conf where c_name='';
# insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_Rest_Entrepreneur_Name',c_value,lng1,lng2,lng3 from conf where c_name='';
# insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_Rest_Entrepreneur_Address',c_value,lng1,lng2,lng3 from conf where c_name='';
# insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_Rest_Workplace_Name',c_value,lng1,lng2,lng3 from conf where c_name='';
# insert into conf (c_name,c_value,lng1,lng2,lng3) select 'flow_Rest_Workplace_Address',c_value,lng1,lng2,lng3 from conf where c_name='';


#2017-04-26
DROP TABLE IF EXISTS `lane_booking_dtl`;
CREATE TABLE `lane_booking_dtl` (
  `booking_dtl_id` int(10) unsigned NOT NULL auto_increment,
  `booking_hdr_id` int(11) NOT NULL,
  `i_player` int(11) NOT NULL,
  `d_datetime` datetime NOT NULL,
  `d_date` varchar(20) NOT NULL,
  `d_time` varchar(20) NOT NULL,
  PRIMARY KEY  (`booking_dtl_id`),
  KEY `index_booking_hdr_id` (`booking_hdr_id`),
  KEY `index_d_date` (`d_date`),
  KEY `index_d_time` (`d_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `lane_booking_hdr`;
CREATE TABLE `lane_booking_hdr` (
  `booking_hdr_id` int(10) unsigned NOT NULL auto_increment,
  `c_type` varchar(50) NOT NULL,
  `lane_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `d_create` datetime NOT NULL,
  `d_update` datetime NOT NULL,
  `d_booking` date NOT NULL,
  `d_booking_time` time NOT NULL,
  `i_start_hour` int(11) NOT NULL,
  `i_start_player` int(11) NOT NULL,
  `booking_name` varchar(255) NOT NULL,
  `booking_tel` varchar(100) NOT NULL,
  `e_status` enum('normal','cancel') default 'normal',
  PRIMARY KEY  (`booking_hdr_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
	