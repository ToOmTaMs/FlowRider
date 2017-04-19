
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