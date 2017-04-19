<?php
class Report extends Resource
{
	
	private $db_sqlite=null;	
	private $db_mysql=null;
	private $isDebug = false ;
	private $report_params = array();

    private $url;
    private $username;
    private $password;
    private $report_folder;    
    	
	public function __construct($params) {
    	parent::__construct($params); 
    	
    	$this->db_mysql	= $this->db;
    	
    	if( $_SERVER['HTTP_HOST'] == "103.40.138.229:82" )
    		$this->url = "http://localhost:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	else if( $_SERVER['HTTP_HOST'] == "192.168.1.225" )
    		$this->url = "http://192.168.1.98:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	else $this->url = "http://139.59.230.249:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	

 
    	    	
		$this->username = "jasperadmin"; // << กำหนด user ของ jasperserver
		$this->password = "jasperadmin"; // << กำหนด password ของ jasperserver
		
		$sql = "select c_desc from a_code where c_group='jasperreports' and c_code='report_folder' ";
		$this->report_folder = $this->db_mysql->i_get_field($sql);
		
		if( $this->report_folder == "" ) $this->report_folder = "fr_enterprise_test";
		 
		//$this->url = "http://139.59.230.249:8080/jasperserver/services/repository";  
 		//$this->report_folder = "fr";
 		
 		//$this->url = "http://192.168.10.1:8080/jasperserver/services/repository";  
 		//$this->report_folder = "fr";
 		
 		
    	//$this->url = "http://192.168.1.98:8080/jasperserver/services/repository";
    	//$this->report_folder = "fr_enterprise";
    	
    	//$this->url = "http://203.147.39.167:8080/jasperserver/services/repository";	
		//$this->report_folder = "fr_enterprise";	
		
	}


 	public function get() {
 		
 		if( isset($this->params[0]) ){
			
			$sql = "select * from a_report where c_type='".$this->params[0]."' ";
			$dt1 = $this->db_mysql->i_get_rows($sql);
			$this->send_ok($dt1);
			
			
		}else{
			$sql = "select * from a_report where e_status = 'active' order by c_seq";
			$dt1 = $this->db_mysql->i_get_rows($sql);
			$this->send_ok($dt1);			
		}
 		
 		

	}

	public function test() {
		$this->send_ok(true);
	}
		
	public function post() {
 		$this->send_ok(true);		
	}
	
	public function max_allowed() {	
	
		//2016-02-02 แก้ปัญหาเรื่อง ออกรายงานไม่ได้
		//$sql = "SET GLOBAL max_allowed_packet=16777216";   //16M
		//$sql = "SET GLOBAL max_allowed_packet=33554432";   //32M
		$sql = "SET GLOBAL max_allowed_packet=67108864";   //64M
		//$sql = "SET GLOBAL max_allowed_packet=134217728";   //128M
		//$sql = "SET GLOBAL max_allowed_packet=268435456";   //256M
		$this->db_mysql->i_query($sql);	
	}
	
	public function jasper_stop() {
		
		//SHOW VARIABLES LIKE 'max_allowed_packet';
		$this->max_allowed();
		
		
		$sql = "select c_desc from a_code where c_group='jasperreports' and c_code='STOP' ";
		$program = $this->db_mysql->i_get_field($sql);
		//echo $program;
		
		//echo exec('whoami');

		$output = exec($program) ;
		//var_dump($output);
		
		$this->send_ok(true);
	}
	public function jasper_start() {
		
		$sql = "select c_desc from a_code where c_group='jasperreports' and c_code='START' ";
		$program = $this->db_mysql->i_get_field($sql);
		//echo $program;
		
		$output = exec($program) ;
		//var_dump($output);		
		
		$this->send_ok(true);
	 
	}
	
	

    
   //////////////////////////////////////////////////////////////
	
	public function iInsert_rp_gen_id() {		
		$ht1["company_id"] = $this->u_company_id ;
		$ht1["c_table_name"] = $_POST['c_table_name'] ; 
		
		$sql = " DELETE FROM rp_gen_id WHERE company_id='".$ht1["company_id"] ."' and c_table_name = '".$ht1["c_table_name"]."' ";
		$this->db->iQuery($sql);
		foreach( $_POST['list_table_id'] as $i1 => $r1 ){
			$ht1["table_id"] = $r1;
			$this->db->iInsert("rp_gen_id",$ht1);
		}
		$this->send_ok($_POST);	
	}
 
    ////////////////////////////////////////////////////////////// 	
  	
  	public function get_report() {
  		$this->get_report_main('PDF');
  	}
  	
  	public function get_report_excel() {
		$this->get_report_main('XLS');
	}
	
	public function get_report_csv() {
		$this->get_report_main('CSV');
	}
  	
  	

  	protected function get_report_main($format) {
		
		//2016-02-02 แก้ปัญหาเรื่อง ออกรายงานไม่ได้
		$this->max_allowed();
		
		
		//$jasper_url = "http://localhost:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
 
		//$this->url = "http://192.168.1.88:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
		//$this->url = "http://203.147.39.167:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
		//$this->url = "http://139.59.230.249:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
		//$this->username = "jasperadmin"; // << กำหนด user ของ jasperserver
		//$this->password = "jasperadmin"; // << กำหนด password ของ jasperserver
		
	
		//var_dump($this->params);
		
		//$report_params['get_report'] = "param";
		//$report_params['report_type'] = "testmm";
		//$report_params['report_type'] = "reprot_test";
		
		/*
		//เรียก php_fn
		//แปลง parameter เป็น array
		for($i=0;$i<count($this->params);$i=$i+2){
    		//var_dump($this->params[$i] );
    		if($this->params[$i] == ""){
    			unset($this->params[$i]);
   				break;  			
    		}    
    	}
    	*/


		$report_params = $this->get_params();

		
		//for($i=0;$i<count($this->params);$i=$i+2){
		//	$report_params[$this->params[$i]] = $this->params[$i+1];				
		//  }		 
		
		//var_dump($report_params);
		
		/*
		if(isset($report_params['pdaterange'])) {
			$report_params['pdaterange'] = substr($report_params['pdaterange'], 0, 10)." ".substr($report_params['pdaterange'], 10, 18);
		}
		if(isset($report_params['pdaterange2'])) {
			$report_params['pdaterange2'] = substr($report_params['pdaterange2'], 0, 10)." ".substr($report_params['pdaterange2'], 10, 18);
		}
		*/
		//echo $this->url;
			
		//$sql = "select c_desc from a_code where c_group='jasperreports' and c_code='report_folder' ";
		//$report_folder = $this->db_mysql->i_get_field($sql);
		
		//if( $report_folder == "" ) $report_folder = "fr_enterprise_test";
		
		
		//$report_unit = "/reports/Pruksa_MM/".$report_params['report_type']; // << กำหนด report ที่ต้องการแสดง (ต้องใช้ชื่อ folder ตามที่แสดงใน jasperserver)
		//$report_unit = "/reports/Pruksa_MM_Test/".$report_params['report_type']; // << กำหนด report ที่ต้องการแสดง (ต้องใช้ชื่อ folder ตามที่แสดงใน jasperserver)
		//$report_unit = "/reports/fr_enterprise_test/".$report_params['report_type']; // << กำหนด report ที่ต้องการแสดง (ต้องใช้ชื่อ folder ตามที่แสดงใน jasperserver)
		
		$report_unit = "/reports/".$this->report_folder."/".$report_params['report_type']; // << กำหนด report ที่ต้องการแสดง (ต้องใช้ชื่อ folder ตามที่แสดงใน jasperserver)
		
		
		//$report_unit = "/reports/Pruksa_MM/testmm";		
		//$report_unit = "/reports/Pruksa_MM/PO";	
		
		//$report_unit = "/reports/9net/".$report_params['report_type']; // << กำหนด report ที่ต้องการแสดง (ต้องใช้ชื่อ folder ตามที่แสดงใน jasperserver)
		$report_format = $format ; //"PDF"; // << กำหนด รูปแบบการแสดงผล PDF, XLS, DOC , CSV
	    	 
	   // exit ;
	   
 		//$this->url = "http://103.40.138.229:8080/jasperserver/services/repository";
 		//$report_unit = "/reports/fr_enterprise/sl_002";
 		
	    
	    $result = $this->requestReport($report_unit, $report_format,$report_params);
	    

	    
	 	if( $format == "PDF" ){
		    //echo "report_unit = ".$report_unit."<br>";
		    //var_dump( $report_params );
		    //echo "<br>";		
		    
		   	if( !$this->isDebug ){ 
				header('Content-type: application/pdf; charset="UTF-8"'); // << ประกาศ header ให้แสดงผลเป็น 
			}
		    
			echo $result;
		    	
		}else if( $format == "XLS" ){ 
		    $filename = $report_params['report_type']."_".$this->today.".xls";			
		    
		    if( !$this->isDebug ){
			    header('Content-Type: application/xls; charset="UTF-8" '); // << ประกาศ header ให้แสดงผลเป็น excel
				header("Content-Disposition: attachment;  filename='".$filename."' ");#ชื่อไฟล์		
			}

		    
		    echo $result;
		    
		}else if( $format == "CSV" ){ 
		    $filename = $report_params['report_type']."_".$this->today.".csv";	
			//CSV
			if( !$this->isDebug ){
				header('Content-Type: application/csv; charset="UTF-8" '); // << ประกาศ header ให้แสดงผลเป็น excel
				header("Content-Disposition: attachment;  filename='".$filename."' ");#ชื่อไฟล์			    
		    } 
		    
		    //echo $result;
		    		    
		    //แปลงเป็นภาษาไทยด้วยการ replace code latin1 เป็น utf8
		   // $result = $this->latin2Utf8($result);
		   
		   $result = trim($result);
		    
		   $result = $this->Utf8_to_text($result);  
		    
 		   $chkRow = array();
		    
	 
	   		$tmp_result = $result; 

	   		$tmp_result = str_replace("\n","<br>",$tmp_result  ) ; 
	   		$tmp_result = str_replace("\r","rrrr",$tmp_result  ) ;	   		 
	   		$tmp_result = substr($tmp_result,0,strpos($tmp_result,'rrrr'));	
	   		
	   		$array = explode("<br>", $tmp_result);
	   		
	   		$sql = " select c_name from a_company where id=".$this->u_company_id  ;
	   		//echo $sql;
	   		$company_name = trim( $this->db_mysql->iGetField($sql) );
	   		
	   		$sql = " select i_header from a_report where report_type='".$report_params['report_type']."' "  ;
	   		
	   		$i_header = $this->db_mysql->iGetField($sql)  ;
	   		
	   		
	   		//echo $company_name;
	   		$f00 = array("Page","หน้า");
	   		$f01 = array("Report","รายงาน",$company_name);
	   		$f02 = array();
	   		
	   		//echo "count(array)= ".count($array)."<br>";
	   		
	   		if( count($array) > $i_header ){ 
	   			for( $i=0;$i<$i_header; $i++)
	   				$f02[] = $array[$i];	
	   		}
 
	   			
	   		//var_dump($f02);	
	   		
	   		//var_dump($array);
	   		$tmp_result2 = "";
	   		
	   		foreach( $array as $i1 => $r1 ){ 
	   			
	   			$chkBeark = false;
	   			foreach( $f00 as $i2 => $f2){
	   				$chkPosition = strpos($r1,$f2);
	   				if( !$chkPosition ) $chkPosition = -1;
	   				//if( $this->isDebug ) echo "f00 --->". $r1."<-->". $f2. "-->" . $chkPosition."<br>"; 
					if( $chkPosition > -1 ){
						 //echo strpos($r1,$f2);
						 //echo $r1."<br>";
						 if( isset($chkRow[$f2]) ){
							if( $this->isDebug ) echo "f00 Delete $f2 <br>";
							$chkRow[$f2]++;
							$chkBeark = true;
							break;
						}
						else{				
							$chkRow[$f2] = 1;
						}
						  
						 
					}
				}
				if( $chkBeark )	continue;
				
				foreach( $f01 as $i2 => $f2){
					$chkPosition = strpos($r1,$f2);
					if( !$chkPosition ) $chkPosition = -1;
	   				//if( $this->isDebug ) echo "f01 --->". $r1."<-->". $f2. "-->" . $chkPosition."<br>"; 
	   				if( $chkPosition > -1 ){
	   					//if( $this->isDebug ) echo "f01 --->". $r1."<-->". $f2. "-->" . $chkPosition."<br>";
						if( isset($chkRow[$f2]) ){
							if( $this->isDebug ) echo "f01 Delete $f2 <br>";
							$chkRow[$f2]++;
							$chkBeark = true;
							break;
						}
						else{					
							$chkRow[$f2] = 1;
						}
					}
											
					
				}
				if( $chkBeark )	continue;
				//echo $r1."<br>";
				
				foreach( $f02 as $i2 => $f2){
					//if( $this->isDebug ) echo "f02 --->". $r1."<-->". $f2. "-->xxxxx" . "<br>"; 
					if($r1==$f2){
						//if( $this->isDebug ) echo "f02 --->". $r1."<-->". $f2. "-->xxxxx" . "<br>"; 
						if( isset($chkRow[$f2]) ){
							if( $this->isDebug ) echo "f02 Delete $f2 <br>";
							$chkRow[$f2]++;
							$chkBeark = true;
							break;
						}
						else{					
							$chkRow[$f2] = 1;
						}
					}
				}
				if( $chkBeark )	continue;
				
				
				$tmp_result2 .= $r1."\n";
			}
			$xx = $array[7];
			echo $xx;
			
			
	   		$tmp_result = $tmp_result2;	
	   						
			if( $this->isDebug ){
				$tmp_result2 = str_replace("\n","<br>",$tmp_result2  ) ; 
				$tmp_result2; echo "<br><br>".$tmp_result2."<br><br>";
				echo $tmp_result2;
				
				$result = $tmp_result ;
				
				
			}else{
				$result = $tmp_result ;
			}
		   
		   			
			
		   	if( $this->isDebug ){
				$xx = $array[5];
				//$xx = str_replace(" ","\t",$xx  ) ;
			
				echo $xx;
				echo " >>";
			
				$array2 = explode(",", $xx);
		 		echo $array2[2];
				$ord = ord($array2[2]);
				$chr = chr($ord);
				echo $array2[2]."-".$ord."-".$chr;
		   		echo "<< ";
		   	}
		   
		   //2017-04-03 หลอก excel ว่่า ไม่เห็นตัวเลข	
		   //$chr = chr(32);
		   //$result = str_replace($chr ,"\t",$result  ) ;
			
		   $result = str_replace("   ","\t",$result  ) ;	 
		   
		    
		   
		   
		   	
		   echo $result;
			 
		    /*
		   $tmp_result = $result; 
 
		   //$tmp_result = str_replace("\n","<br>",$tmp_result  ) ; 
		   $tmp_result = str_replace("\r","rrrr",$tmp_result  ) ;	   		 
		   $tmp_result = substr($tmp_result,0,strpos($tmp_result,'rrrr'));	
		   $result = $tmp_result;
		   
		   echo $result;
		   */
		 
		    	
		}
		
		exit;		
	}
 
  protected function requestReport($report_unit, $format, $params) {
  	$debug = "";
    $params_xml = "";
    foreach ($params as $name => $value) {
      $params_xml .= "<parameter name=\"$name\"><![CDATA[$value]]></parameter>\n";
      $debug .= $name.">".$value. "<br>";
    }
    
    
	if( $this->isDebug ){
		echo "url = ".$this->url."<br>";  
		echo "username = ".$this->username."<br>";  
		echo "password = ".$this->password."<br>"; 
		echo "report_unit = ".$report_unit."<br>";
		echo "format=".$format ."<br>";  
		echo "params =". $debug ."<br><br>";
	} 
		
    $request = "
      <request operationName=\"runReport\" locale=\"th\">
        <argument name=\"RUN_OUTPUT_FORMAT\">$format</argument>
        <resourceDescriptor name=\"\" wsType=\"\"
        uriString=\"$report_unit\"
        isNew=\"false\">
        <label>null</label>
        $params_xml
        </resourceDescriptor>
      </request>
    ";
    		  
    $request = "
      <request operationName=\"runReport\" locale=\"en\">
        <argument name=\"RUN_OUTPUT_FORMAT\">$format</argument>
        <resourceDescriptor name=\"\" wsType=\"\"
        uriString=\"$report_unit\"
        isNew=\"false\">
        <label>null</label>
        $params_xml
        </resourceDescriptor>
      </request>
    ";
  
	if($this->isDebug){
		echo "request<br>";  
		var_dump($request);
		echo "<br><br>";	
	}    

	    	
	    	
    
    $client = new SoapClient(null, array(
        'location'  => $this->url,
        'uri'       => 'urn:',
        'login'     => $this->username,
        'password'  => $this->password,
        'trace'    => 1,
        'exception'=> 1,
        'soap_version'  => SOAP_1_1,
        'style'    => SOAP_RPC,
        'use'      => SOAP_LITERAL

      ));
      
	if($this->isDebug){
		echo "client<br>";  
		var_dump($client);
		echo "<br><br>";
	}
	    	
	if($this->isDebug){ 
		$requestXmlString =  new SoapParam($request,"requestXmlString")  ;
		echo "requestXmlString<br>";  
		var_dump($requestXmlString);
		echo "<br><br>";		
	} 
 
    $pdf = null;
    try {
      $result = $client->__soapCall('runReport', array(
        new SoapParam($request,"requestXmlString") 
      ));
      
      $pdf = $this->parseReponseWithReportData(
        $client->__getLastResponseHeaders()
        ,$client->__getLastResponse()
        ,$format
        );
    } catch(SoapFault $exception) {
      $responseHeaders = $client->__getLastResponseHeaders();
      
	if($this->isDebug){ 
		echo "catch responseHeaders <br>";
		var_dump($responseHeaders);
		echo "<br><br>";
	}
				
				
				
      if ($exception->faultstring == "looks like we got no XML document" &&
          strpos($responseHeaders, "Content-Type: multipart/related;") !== false) {
        $pdf = $this->parseReponseWithReportData(
        	$responseHeaders
        	, $client->__getLastResponse()
        	, $format
        	);
      } else {
        throw $exception;
      }
    }
    
    if ($pdf)
      return $pdf;
    else
      throw new Exception("Jasper did not return PDF data. Instead got: \n$pdf");
  }
  
  protected function parseReponseWithReportData($responseHeaders, $responseBody,$format) {

	if($this->isDebug){ 
		echo "PDF responseHeaders <br>";
		var_dump($responseHeaders);
		echo "<br><br>";

		preg_match('/boundary="(.*?)"/', $responseHeaders, $matches);
		echo "PDF matches <br>";
		var_dump($matches);
		echo "<br><br>";
	}


  	
    preg_match('/boundary="(.*?)"/', $responseHeaders, $matches);
    $boundary = $matches[1];
    $parts = explode($boundary, $responseBody);
      
    //$pdf = null;
    //foreach($parts as $part) {
    //  if (strpos($part, "Content-Type: application/pdf") !== false) {
    //    $pdf = substr($part, strpos($part, '%PDF-'));
    //    break;
    //  }
    //}
    
    
	switch ($format) {
		case 'PDF':
			//foreach($parts as $part) {
			//   if (strpos($part, "Content-Type: application/pdf") !== false) { 
			//      $pdf = substr($part, strpos($part, '% $format-'));
			//      break;
			//   }
			//}	
			foreach($parts as $part) {
		      if (strpos($part, "Content-Type: application/pdf") !== false) {
		        $pdf = substr($part, strpos($part, '%PDF-'));
		        break;
		      }
		    }	
		case 'XLS':
            foreach($parts as $part) {
                if (strpos($part, "Content-Type: application/xls") !== false) {
                    $pdf = substr($part, (strpos($part, '<report>') + 9));
                    break;
                }
            }
        case 'CSV':
            foreach($parts as $part) {
                if (strpos($part, "Content-Type: application/vnd.ms-excel") !== false) {
                    $contentStart = strpos($part, 'Content-Id: <report>') + 24;
                    $pdf = substr($part, $contentStart);
                    break;
                }        
			}
	}	
		
		
    
    return $pdf;
  }

 


	/*
	protected function requestReport($report_unit, $format, $params) {
	    

$params = null;
$params["company_id"] = 1001 ;
$params["PDate"] = "2017-02-02" ;
$params["PDate2"] = "2017-02-02" ;
$params["Plng1"] = 1 ;



	    $debug = "";
	    $params_xml = "";
		foreach ($params as $name => $value) {
		    $params_xml .= "<parameter name=\"$name\"><![CDATA[$value]]></parameter>\n";
		    $debug .= $name.">".$value. "<br>";
		}
		   
   
	 	if( $this->isDebug ){
	 		echo "url = ".$this->url."<br>";  
			echo "username = ".$this->username."<br>";  
			echo "password = ".$this->password."<br>"; 
			echo "report_unit = ".$report_unit."<br>";
			echo "format=".$format ."<br>";  
	 		echo "params =". $debug ."<br><br>";
		} 
		    
	  $params_xml = "";
		    	    
	    $request = "
	      <request operationName=\"runReport\" locale=\"th\">
	        <argument name=\"RUN_OUTPUT_FORMAT\">$format</argument>
	        <resourceDescriptor name=\"\" wsType=\"\"
	        uriString=\"$report_unit\"
	        isNew=\"false\">
	        <label>null</label>
	        $params_xml
	        </resourceDescriptor>
	      </request>
	    ";
	    if( $this->isDebug ){
	    	echo "request<br>";    
	    	var_dump($request);
	    	echo "<br><br>"; 
	    }


 
      
      
	       
		         
	    $client = new SoapClient(null, array(
	        'location'  => $this->url,
	        'uri'       => 'urn:',
	        'login'     => $this->username,
	        'password'  => $this->password,
	        'trace'    => 1,
	        'exception'=> 1,
	        'soap_version'  => SOAP_1_1,
	        'style'    => SOAP_RPC,
	        'use'      => SOAP_LITERAL

	      ));
	      
	    if( $this->isDebug ){  
	    	echo "client<br>";  
	    	var_dump($client);
	    	echo "<br><br>";  
	    }
	    
	    $pdf = null;
	      
	    try {
	      $result = $client->__soapCall('runReport', array(
	        new SoapParam($request,"requestXmlString") 
	      ));
	     
	      $pdf = $this->parseReponseWithReportData(
	        $client->__getLastResponseHeaders(),
	        $client->__getLastResponse(),
			$format);
	    } 
		catch( SoapFault $exception ) 
		{
				
			$responseHeaders = $client->__getLastResponseHeaders();
			
			if( $this->isDebug ){
				echo "catch responseHeaders <br>";
				var_dump($responseHeaders);
				echo "<br><br>";
			}
			
			
			if($exception->faultstring == "looks like we got no XML document" 
				&&  strpos($responseHeaders, "Content-Type: multipart/related;") !== false) {
				
				$pdf = $this->parseReponseWithReportData(
					$responseHeaders, 
					$client->__getLastResponse(),
					$format);
			} else {
				throw $exception;
			}
				
		}  
		
		return $pdf;  
		
		if ($pdf)
	      return $pdf;
	    else
	      throw new Exception("Jasper did not return PDF data. Instead got: \n$xls");
	     

	  }

	protected function parseReponseWithReportData($responseHeaders, $responseBody,$format) {
			
		if( $format == 'PDF' ){
			if( $this->isDebug ){
				echo "PDF responseHeaders <br>";
				var_dump($responseHeaders);
	  			echo "<br><br>";	
	  			
	  			preg_match('/boundary="(.*?)"/', $responseHeaders, $matches);
	  			echo "PDF matches <br>";
				var_dump($matches);
	  			echo "<br><br>";
	  			
	  		}
		}	
	    
	      		
		preg_match('/boundary="(.*?)"/', $responseHeaders, $matches);
	    $boundary = $matches[1];
	    $parts = explode($boundary, $responseBody);
	    
    	     
	    $reportOutput = "";
		switch ($format) {
			case 'PDF':
				foreach($parts as $part) {
				   if (strpos($part, "Content-Type: application/pdf") !== false) { 
				      $reportOutput = substr($part, strpos($part, '% $format-'));
				      break;
				   }
				}		
			case 'XLS':
	            foreach($parts as $part) {
	                if (strpos($part, "Content-Type: application/xls") !== false) {
	                    $reportOutput = substr($part, (strpos($part, '<report>') + 9));
	                    break;
	                }
	            }
	        case 'CSV':
	            foreach($parts as $part) {
	                if (strpos($part, "Content-Type: application/vnd.ms-excel") !== false) {
	                    $contentStart = strpos($part, 'Content-Id: <report>') + 24;
	                    $reportOutput = substr($part, $contentStart);
	                    break;
	                }        
				}
		}	
	    
	    return $reportOutput;
	  }  
	*/
	
	
 	//////////////////////////////////////////////////////////////	
 
  	protected function Utf8_to_text($data) {
 		return iconv("utf-8","tis-620",$data); 	
 	}
 	 
  	protected function latin2Utf8($result){
		
		//เอาตัวหนังสือที่เป็น latin1 แปลงเป็น utf8
		for( $i=161;$i<=250;$i++){
			$result =  str_replace( $this->char_encode($i) , $this->char_encode(($i+3424)) , $result );
		}
		return $result;
	}
	
	protected function char_encode($code){
	  $string1 = '&#' . ($code) . ';'; 
	  $str = mb_convert_encoding($string1,'UTF-8','HTML-ENTITIES');
	  return $str ;
	}


 
 	//////////////////////////////////////////////////////////////
 
 

		
		
 	function get_params(){
 		
  
  		for($i=0;$i<count($this->params);$i=$i+2){
    		//var_dump($this->params[$i] );
    		if($this->params[$i] == ""){
    			unset($this->params[$i]);
   				break;  			
    		}    
    	}
    	
   
    	
 		$report_params = array();
 		$tmp_report_params = array();
 		for($i=0;$i<count($this->params);$i=$i+2){
 			$report_params[$this->params[$i]] = $this->params[$i+1];	
 		}
 		
 		if(isset($report_params["token"])){
			$token = $report_params["token"];
			if( !$this->verifyToken($token,false) ){
				echo "Auth. Fail";
				exit;
			}else{
				unset($report_params["token"]);
				
				if(!isset($report_params["company_id"]))
					$report_params["company_id"]=$this->u_company_id ;
				if(!isset($report_params["location_id"]))
					$report_params["location_id"]=$this->u_location_id ;					
					
			}
			
		}
	 		 
		if( isset($report_params["isDebug"]) ) $this->isDebug = true;	
		
		if( isset($report_params["php_fn"]) ){			
			$sql = " select trim(php_fn) from a_report where report_type = '".$report_params["report_type"]."' ";
			$php_fn = $this->db_mysql->iGetField($sql);
			unset($report_params["php_fn"]);
			if( $php_fn != "") $report_params["php_fn"] = $php_fn;			
		}

		unset($report_params['token']);
		unset($report_params['isDebug']);
			 	 
		$this->report_params = $report_params; 
		
		if( isset($report_params["php_fn"]) ){
			$php_fn = $report_params["php_fn"];
			$this->$php_fn();
		}
 
 		

		if( $this->isDebug ){
			echo "HTTP_HOST = ".$_SERVER['HTTP_HOST']."<br>";
			echo "url = ".$this->url."<br>";
			echo "report_folder = ".$this->report_folder."<br>";
			echo "report_params <br>";
			var_dump($report_params);
			echo "<br><br><br>";
		}
		return $report_params ;		
	}
	
	
	
    public function get_report_test() {

    	for($i=0;$i<count($this->params);$i=$i+2){
    		//var_dump($this->params[$i] );
    		if($this->params[$i] == ""){
    			unset($this->params[$i]);
   				break;  			
    		}    
    	}
      
   		//unset( $this->params[''] );

 
    	$count = count($this->params);
		$this->params[$count] = "isDebug";
		$this->params[$count+1] = "true" ;
		 
		echo "report send param <br>";
  		var_dump($this->params);
  		
  		echo "<br><br>get_report_test<br><br>";
  
		$report_params = $this->get_params();
		 
		echo "report get param <br>"; 
	 	var_dump($report_params);

		exit;
  	}
  	
  		
  	public function genRow($dr){
 		if( $dr == null ){
			echo "No row <br><br>";
			return ;
		}
 		
 		echo "<table border='1' >";

		echo "<tr>";
		foreach( $dr as $j => $col ){
			echo "<td>".$j."</td>";
		}
		echo "</tr>";
 		
 		echo "<tr>";
		foreach( $dr as $j => $col ){
			$col = iconv("tis-620","utf-8",$col); 
			echo "<td>".$col."</td>";
		}
		echo "</tr>";
			
			
 		echo "</table>";		
		return  ;
 		
 	}
 	
 	
 	public function genTable($dt){
		
		if( count($dt) == 0 ){
			echo "No table <br><br>";
			return ;
		}
		
		echo "<table border='1' >";
		
 
 
		$count = 0;
		foreach( $dt as $i => $dr ){
			if($count==0){
				echo "<tr>";
				foreach( $dr as $j => $col ){
					echo "<td>".$j."</td>";
				}
				echo "</tr>";
			}
			
			echo "<tr>";
			foreach( $dr as $j => $col ){
				//$col = iconv("tis-620","utf-8",$col); 
				echo "<td>".$col."</td>";
			}
			echo "</tr>";
			
			$count++;
		} 
		
		echo "</table>";		
		return  ;
	}
	
 	function i_Debug_table($sql,$dt,$text=""){
		
 		if( $this->isDebug ) { 		
 			if( $text != "") echo $text . "<br>";
 			if( $sql != "") echo $sql . "<br><br>";
 			$this->genTable($dt);
 		}		 		
	}
	function i_Debug_text($sql,$text=""){
 		if( $this->isDebug ) {
			if( $text != "") echo $text . "<br>";
			echo $sql . "<br><br>";			 	
		}	
	}	
	function i_Debug_row($sql,$dr,$text=""){
 		if( $this->isDebug ) {
			if( $text != "") echo $text . "<br>";
			if( $sql != "") echo $sql . "<br><br>";
			$this->genRow($dr);
			echo "<br><br>";	
		}	
	}
	
 
  	function i_delete_data_company($table_name,$company_id,$location=0){
 
 		$where_company = " and company_id = '$company_id' "; 
 		if($location!=0) $where_company .= " and location_id = '$location' "; 
		$sql = "DELETE FROM  $table_name where id != 0 $where_company ";
		 
		if( $this->isDebug )  echo "$sql"." <br><br>"; 
		$this->db_mysql->i_query($sql);	 
		
 	}
 
   	function i_get_location($id){
  
 		$sql = " select * from a_company where id = '$id' ";
 	 	$dr_location = $this->db_mysql->i_get_row($sql);  		
 		return $dr_location;
		
 	} 
 	
  	function i_view_location($company_id){
 
 		$where_company = " and company_id = '$company_id' "; 
 		$sql = " select * from a_company where id != 0 and e_company = 'Location' $where_company ";
 	 	$dt_location = $this->db_mysql->i_get_rows($sql);
		//$this->i_Debug_table($sql,$dt_location,"location all=");	 
 		
 		return $dt_location;
		
 	} 
 	
 	function i_report_location($table_name){
   		
 		$report_params=$this->report_params;
 		

  		//if( $this->isDebug ) var_dump($report_params);
  		

 
		$company_id = $report_params["company_id"];	
		//$where_company = " and company_id = '$company_id' "; 
			
		if(isset($report_params["location_id"]))
			$location_id = $report_params["location_id"];
		else 
			$location_id = "0" ;
		
  		if( $location_id == "0" || $location_id == "" ){
 			$dt_location = $this->i_view_location($company_id);
		}			
		else { 
			$r1 = $this->i_get_location($location_id);
			$dt_location[] = $r1;
		} 
		 
		if( $this->isDebug ){
 			echo "i_report_location <br>";			
			echo "table_name = $table_name"." <br>"; 	 
			if( $location_id == 0 ) echo " location_id =  $location_id  > i_view_location <br>";
			else echo " location_id =  $location_id  > i_get_location <br>";
			$this->i_Debug_table("",$dt_location,"dt_location");	  
		}		 
		 
		$this->i_delete_data_company($table_name,$company_id,$location_id);
		
		return $dt_location;
		
 	} 
 	
 	function i_report_show($table_name){
 		
 		$report_params=$this->report_params;
 		
 		$company_id = $report_params["company_id"];	
		$where_company = " and company_id = '$company_id' "; 
		
 		$sql = "select * from $table_name where id != 0 $where_company order by id ";
		$dtBL = $this->db_mysql->i_get_rows($sql); 
 
		$this->i_Debug_table($sql,$dtBL,"report ".$table_name);	 
		
 	}
 	function i_chk_table($table_name){
		$sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='$table_name' ";
		$chkTable = $this->db_sqlite->i_get_field($sql);
		if( $chkTable == "" )return false;
		return true;
	}
 	
 	
 
  	//////////////////////////////////////////////////////////////
   	public function sl_001(){
   		 
   		$report_params=$this->report_params;
   		
		$table_name = "rp_sl_001";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";				
			$where_d_date = " and d.d_operate >= '$dStart' and d.d_operate <= '$dEnd' ";	
			$where_pm_date = " and pm.d_operate >= '$dStart' and pm.d_operate <= '$dEnd' ";

 
			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate ,  c.menu_id 
, c.lng1_c_name as menu_lng1_c_name 
, c.lng2_c_name as menu_lng2_c_name  
, c.lng3_c_name as menu_lng3_c_name  
, sum(ProcFee_Org) as ProcFee_total
, 0 as Percent
, sum(amount) as Amount
, sum(Discount_amt) as Discount
, sum(ProcFee) as ProcFee_amt
from fr_order a , setitem b , setmenu c  
where 
a.item_id = b.item_id
and b.menu_id = c.menu_id
and a.e_status = 'normal'
$where_date
group by a.d_operate , c.menu_id
";
 
 			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, d.d_operate, c.menu_id
, c.lng1_c_name as menu_lng1_c_name 
, c.lng2_c_name as menu_lng2_c_name  
, c.lng3_c_name as menu_lng3_c_name 
, sum(e.ProcFee_amt+e.Discount_amt+e.Special_Discount_amt) as ProcFee_total
, ROUND( ifnull( (sum(e.ProcFee_amt)/x.ProcFee_total)*100  , 0 ) , 2 ) as Percent
, sum(a.amount) as Amount
, sum(e.Discount_amt+e.Special_Discount_amt) as Discount
, sum(e.ProcFee_amt) as ProcFee_amt

from fr_order a, setitem b, setmenu c , payment d , payment_dtl e 

left outer join(


select d.d_operate ,  sum(e.ProcFee_amt+e.Discount_amt+e.Special_Discount_amt) as ProcFee_total
from fr_order a, setitem b, setmenu c , payment d , payment_dtl e 
where a.item_id=b.item_id
and b.menu_id=c.menu_id
and a.e_status='normal'
and d.e_status='normal'
and d.PayType='Receipt'
and d.PayNum=e.PayNum
and e.order_id=a.order_id
and a.tableopen_id=d.tableopen_id 
$where_d_date
group by d.d_operate 


) as x on d.d_operate = x.d_operate  

where a.item_id=b.item_id
and b.menu_id=c.menu_id
and a.e_status='normal'
and d.e_status='normal'
and d.PayType='Receipt'
and d.PayNum=e.PayNum
and e.order_id=a.order_id
and a.tableopen_id=d.tableopen_id  
$where_d_date
group by d.d_operate , c.menu_id

";

			//ใช้ table มาช่วย
			$view_table = $table_name."_view_".$location_id;
			
			$sql = " DROP TABLE IF EXISTS $view_table ";
			$this->db_sqlite->iQuery($sql);
			
			$sql = " 
CREATE TABLE $view_table
AS
select '$company_id' as company_id , '$location_id' as location_id 
, d.d_operate as d_operate ,  sum(e.ProcFee_amt+e.Discount_amt+e.Special_Discount_amt) as ProcFee_total
from fr_order a, setitem b, setmenu c , payment d , payment_dtl e 
where a.item_id=b.item_id
and b.menu_id=c.menu_id
and a.e_status='normal'
and d.e_status='normal'
and d.PayType='Receipt'
and d.PayNum=e.PayNum
and e.order_id=a.order_id
and a.tableopen_id=d.tableopen_id 
$where_d_date
group by d.d_operate 
";
			if( $this->isDebug ) echo "main_sql <br> $sql <br>";
			$this->db_sqlite->iQuery($sql);
			
			if( $this->isDebug ) {
				if( $this->i_chk_table($view_table) ){
					$sql = " select * from $view_table ";
					$dt1 = $this->db_sqlite->i_get_rows($sql); 
					$this->i_Debug_table($sql,$dt1,"main sql");	
				}
			}

			
			

 			$sql = "  
select '$company_id' as company_id , '$location_id' as location_id 
, d.d_operate, c.menu_id
, c.lng1_c_name as menu_lng1_c_name 
, c.lng2_c_name as menu_lng2_c_name  
, c.lng3_c_name as menu_lng3_c_name 
, sum(e.ProcFee_amt+e.Discount_amt+e.Special_Discount_amt) as ProcFee_total
, ROUND( ifnull( (sum(e.ProcFee_amt)/x.ProcFee_total)*100  , 0 ) , 2 ) as Percent
, sum(a.amount) as Amount
, sum(e.Discount_amt+e.Special_Discount_amt) as Discount
, sum(e.ProcFee_amt) as ProcFee_amt

from   setitem b, setmenu c , payment d , payment_dtl e , fr_order a

LEFT JOIN $view_table x
on d.d_operate = x.d_operate  

where a.item_id=b.item_id
and b.menu_id=c.menu_id
and a.e_status='normal'
and d.e_status='normal'
and d.PayType='Receipt'
and d.PayNum=e.PayNum
and e.order_id=a.order_id
and a.tableopen_id=d.tableopen_id 
$where_d_date
group by d.d_operate , c.menu_id
";

			if( $this->isDebug ) echo "main_sql <br> $sql <br>";	
			
			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 

			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, pm.d_operate , 99999 as menu_id
, 'ปรับยอด' as  menu_lng1_c_name
, 'Adjust' as  menu_lng2_c_name
, 'Adjust' as  menu_lng3_c_name
, 0 as ProcFee_total
, 0 as Percent
, 0 as Amount
, ((sum(pm.Discount_amt+pm.Special_Discount_amt))-ax.Payment_Dtl_Discount) as Discount
,  -((sum(pm.Discount_amt+pm.Special_Discount_amt))-ax.Payment_Dtl_Discount) as ProcFee_amt
 
from   table_open tb_open, payment pm

left outer join  (
   select pm.d_operate,  
      sum(pm_dtl.Discount_amt+pm_dtl.Special_Discount_amt) as Payment_Dtl_Discount 
   from payment_dtl pm_dtl , payment pm
   where pm.e_status='normal' 
   and PayType='Receipt' 
   and pm_dtl.PayNum=pm.PayNum
   $where_pm_date
   group by pm.d_operate
) as ax on ax.d_operate=pm.d_operate

where pm.e_status='normal' 
and PayType='Receipt'
and tb_open.tableOpen_id=pm.tableOpen_id 
and tb_open.PayNum=pm.PayNum 
$where_pm_date
group by pm.d_operate
";
//order by d_operate , menu_lng1_c_name


			/*
			if( $this->isDebug ) echo "main_sql <br> $sql <br>";	
			
			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 
			*/
		 
			 
		}
 
 		 
 		
		$this->i_report_show($table_name);	 
		  
		$this->db_sqlite = null;
	}
	
  	//////////////////////////////////////////////////////////////
  	public function sl_002(){
 		$this->report_params["location_id"] = 0 ;
 		
 		$report_params=$this->report_params;
 		 
		$table_name = "rp_sl_002"; 
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";		
			
		
			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate , a.ProcFee_Total , a.Special_Discount_amt 
, a.ServiceCharge1_Amt as ServiceCharge_Amt , a.CreditCharge_Amt
, a.Vat_Amt , a.Vat_After as ProcFee_amt
, b.Cash_amt , b.Credit_amt , a.Vat_After - (b.Cash_amt + b.Credit_amt)  as Etc_amt
from payment a , payment_paydtl b
where
a.PayNum = b.PayNum 
and a.e_status = 'normal' 
$where_date
";


/*
			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate , a.ProcFee_Total , a.Special_Discount_amt , a.ServiceCharge1_Amt as ServiceCharge_Amt  , a.CreditCharge_Amt
, a.Vat_Amt , a.ProcFee_amt 
from payment a  
where a.e_status = 'normal'
";
*/

			if( $this->isDebug ) echo "main_sql <br> $sql <br>";	
			
			
			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 
			
			
		}
  
		$this->i_report_show($table_name);	 
		
		$this->db_sqlite = null;
		
	}
 
   	//////////////////////////////////////////////////////////////
   	public function sl_003(){
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_003";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];			
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";		

			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate
, c.menu_id
, c.lng1_c_name as menu_lng1_c_name , c.lng2_c_name as menu_lng2_c_name , c.lng3_c_name as menu_lng3_c_name
, a.item_id 
, a.lng1_item_desc as item_lng1_c_name , a.lng2_item_desc as item_lng2_c_name , a.lng3_item_desc as item_lng3_c_name
,  a.amount
, a.e_status
, '' as status_lng1 , '' as status_lng2 , '' as status_lng3
, time(a.d_create) as order_time
, a.lng1_UserName , a.lng2_UserName , a.lng3_UserName 
, time(f.d_upd) as cancel_time
, f.lng1_UserName as cancelorder_lng1_UserName , f.lng2_UserName as cancelorder_lng2_UserName , f.lng3_UserName as cancelorder_lng3_UserName
from fr_order a , fr_order_cancel f ,  setitem b , setmenu c
where a.order_id = f.order_id
and a.item_id = b.item_id
and c.menu_id = b.menu_id
$where_date 
";
 			
 			if( $this->isDebug ) echo "main_sql <br> $sql <br>";	

			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 
			
			
		}
  
		$this->i_report_show($table_name);	 
		  
		$this->db_sqlite = null;
		
	}
	
	//////////////////////////////////////////////////////////////
   	public function sl_004(){
 		
 		$this->report_params["location_id"] = 0 ;
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_004";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";			
			

			$sql = " 
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate
, time(a.d_create) as d_time
, a.PrtBillNum
, c.lng1_TableName as table_name_lng1 , c.lng2_TableName as table_name_lng2 , c.lng3_TableName as table_name_lng3
, a.ProcFee_Total , a.Special_Discount_amt  , a.ServiceCharge1_Amt as ServiceCharge_Amt
, b.Credit_Charge_amt  as CreditCharge_Amt
, a.Vat_Amt
, a.ProcFee_amt
, b.Cash_amt , b.Credit_amt
, 0 as Etc_amt
, a.e_status
, a.lng1_UserName , a.lng2_UserName , a.lng3_UserName
, '' as c_reason
from payment a , payment_paydtl b , table_open c
where a.PayNum = b.PayNum
and a.tableOpen_id = c.tableOpen_id
$where_date 
";
 			if( $this->isDebug ) echo "main_sql <br> $sql <br>";	

			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 	 
			
		}
  
		$this->i_report_show($table_name);	  
		  
		$this->db_sqlite = null;
		
	}
		
	//////////////////////////////////////////////////////////////
   	public function sl_005(){
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_005";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";			
			
			$limit = "";
			if( isset($report_params["limit"]) ) $limit = " limit ". $report_params["limit"] ;
			
				
			$where_menu = "";
			if( isset($report_params["menu_id"]) )
				if( $report_params["menu_id"] != 0)
					$where_menu = " and b.menu_id = '".$report_params["menu_id"]."' ";
					
					
			//ใช้ table มาช่วย
			$view_table = $table_name."_view_".$location_id;
			
			$sql = " DROP TABLE IF EXISTS $view_table ";
			$this->db_sqlite->iQuery($sql);
			
			$sql = " 
CREATE TABLE $view_table
AS
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate  as d_operate
, 0 as c_seq
, c.menu_id
, c.lng1_c_name as menu_lng1_c_name , c.lng2_c_name as menu_lng2_c_name , c.lng3_c_name as menu_lng3_c_name
, b.c_code 
, a.item_id
, a.lng1_item_desc as item_lng1_c_name , a.lng2_item_desc as item_lng2_c_name , a.lng3_item_desc as item_lng3_c_name
, sum(a.amount) as Amount
, 0 as Sale_Percent
, sum(a.ProcFee) as Sale_Price 
from fr_order a , setitem b , setmenu c
where a.item_id = b.item_id
and b.menu_id = c.menu_id
and a.e_status = 'normal'
$where_date 
$where_menu
group by a.item_id , a.d_operate 
order by d_operate , Sale_Price  desc  
";
			if( $this->isDebug ) echo "main_sql <br> $sql <br>";
			$this->db_sqlite->iQuery($sql);

 
			if( !$this->i_chk_table($view_table) ){
				if( $this->isDebug ) echo "No data <br><br>";
				continue;
			}
			
						
			if( $this->isDebug ) {
				//$sql = " select * from $view_table ";
				//$dt1 = $this->db_sqlite->i_get_rows($sql); 
				//$this->i_Debug_table($sql,$dt1,"main sql");				
			}
			
			
			if( $limit == "" ){
				$sql = " select * from $view_table ";
				$dt1 = $this->db_sqlite->i_get_rows($sql); 
				if( count($dt1) == 0 ) continue;
				$this->i_Debug_table($sql,$dt1,"main sql");
						 
				//insert in mysql
				foreach($dt1 as $i2=>$r2){
					$this->db_mysql->iInsert($table_name,$r2);	
				}
				continue;				
			}
			
			
			$sql = " select d_operate from $view_table group by d_operate "; 
			$dt_date = $this->db_sqlite->i_get_rows($sql);
			
			foreach($dt_date as $i3 => $r3){				
				$d_operate = $r3["d_operate"];
								
				$sql = " select * from $view_table where d_operate = '$d_operate' order by Sale_Price $limit "; 
				$dt1 = $this->db_sqlite->i_get_rows($sql);
				if( count($dt1) == 0 ) continue;

				
				$Sale_Price_Total = 0;
				foreach($dt1 as $i2=>$r2) $Sale_Price_Total += $r2["Sale_Price"];
				if($Sale_Price_Total == 0 ) $Sale_Price_Total = 100;
						 
				//insert in mysql
				foreach($dt1 as $i2=>$r2){
					$r2["Sale_Percent"] = round( $r2["Sale_Price"] / $Sale_Price_Total * 100 , 2 );
					$dt1[$i2]["Sale_Percent"] = $r2["Sale_Percent"];
					$this->db_mysql->iInsert($table_name,$r2);	
				} 	
			
				$this->i_Debug_table($sql,$dt1,"main sql");				
			
			}
 		 
		}
  
		$this->i_report_show($table_name);	 
		  
		$this->db_sqlite = null;
		
	}
		
	//////////////////////////////////////////////////////////////
   	public function sl_006(){
 		
 		$this->report_params["location_id"] = 0 ; 		
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_006";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";			
			
			$limit = "";
			if( isset($report_params["limit"]) ) $limit = " limit ". $report_params["limit"] ;
			
				
			$where_menu = "";
			if( isset($report_params["menu_id"]) )
				if( $report_params["menu_id"] != 0)
					$where_menu = " and b.menu_id = '".$report_params["menu_id"]."' ";
					
					
			//ใช้ table มาช่วย
			$view_table = $table_name."_view_".$location_id;
			
			$sql = " DROP TABLE IF EXISTS $view_table ";
			$this->db_sqlite->iQuery($sql);
			
			$sql = " 
CREATE TABLE $view_table
AS
select '$company_id' as company_id , '$location_id' as location_id 
, a.d_operate  as d_operate
, 0 as c_seq
, c.menu_id
, c.lng1_c_name as menu_lng1_c_name , c.lng2_c_name as menu_lng2_c_name , c.lng3_c_name as menu_lng3_c_name
, b.c_code 
, a.item_id
, a.lng1_item_desc as item_lng1_c_name , a.lng2_item_desc as item_lng2_c_name , a.lng3_item_desc as item_lng3_c_name
, sum(a.amount) as Amount
, 0 as Sale_Percent
, sum(a.ProcFee) as Sale_Price 
from fr_order a , setitem b , setmenu c
where a.item_id = b.item_id
and b.menu_id = c.menu_id
and a.e_status = 'normal'
$where_date 
$where_menu
group by a.item_id , a.d_operate 
order by d_operate , Sale_Price  desc  
";
			if( $this->isDebug ) echo "main_sql <br> $sql <br>";
			$this->db_sqlite->iQuery($sql);
			
			if( !$this->i_chk_table($view_table) ){
				if( $this->isDebug ) echo "No data <br><br>";
				continue;
			}
			
			if( $this->isDebug ) {
				//$sql = " select * from $view_table ";
				//$dt1 = $this->db_sqlite->i_get_rows($sql); 
				//$this->i_Debug_table($sql,$dt1,"main sql");				
			}
			
			
			if( $limit == "" ){
				$sql = " select * from $view_table ";
				$dt1 = $this->db_sqlite->i_get_rows($sql); 
				if( count($dt1) == 0 ) continue;
				$this->i_Debug_table($sql,$dt1,"main sql");
						 
				//insert in mysql
				foreach($dt1 as $i2=>$r2){
					$this->db_mysql->iInsert($table_name,$r2);	
				}
				continue;				
			}
			
			
			$sql = " select d_operate from $view_table group by d_operate "; 
			$dt_date = $this->db_sqlite->i_get_rows($sql);
			
			foreach($dt_date as $i3 => $r3){				
				$d_operate = $r3["d_operate"];
								
				$sql = " select * from $view_table where d_operate = '$d_operate' order by Sale_Price $limit "; 
				$dt1 = $this->db_sqlite->i_get_rows($sql);
				if( count($dt1) == 0 ) continue;

				
				$Sale_Price_Total = 0;
				foreach($dt1 as $i2=>$r2) $Sale_Price_Total += $r2["Sale_Price"];
				if($Sale_Price_Total == 0 ) $Sale_Price_Total = 100;
						 
				//insert in mysql
				foreach($dt1 as $i2=>$r2){
					$r2["Sale_Percent"] = round( $r2["Sale_Price"] / $Sale_Price_Total * 100 , 2 );
					$dt1[$i2]["Sale_Percent"] = $r2["Sale_Percent"];
					$this->db_mysql->iInsert($table_name,$r2);	
				} 	
			
				$this->i_Debug_table($sql,$dt1,"main sql");				
			
			}
 		 
		}
  
		$this->i_report_show($table_name);	 
		  
		$this->db_sqlite = null;
		
	} 
 
	//////////////////////////////////////////////////////////////
   	public function sl_007(){
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_007";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";			
			

			$sql = " 

select '$company_id' as company_id, '$location_id' as location_id, 
a.d_operate, 0 as c_seq,
d.ProdGroup_id, 
e.lng1_c_name as ProdGroup_lng1_c_name, e.lng2_c_name as ProdGroup_lng2_c_name, e.lng3_c_name as ProdGroup_lng3_c_name, 
d.Prod_Barcode,
b.ProdNum, d.lng1_ProdName, d.lng2_ProdName, d.lng3_ProdName,
c.lng1_OutUnit, c.lng2_OutUnit, c.lng3_OutUnit,
b.PrvAmountUnit as Previous_stock,
b.stock_in as Stock_in,
b.stock_out as Used_amount,
0 as Adjust_add,
0 as Adjust_del,
b.BalanceAmountUnit as Balance
 
from xferhdr a , xferdtl_ext c
, Product d , product_group e , xferdtl b
where a.id = b.xferhdr_id
and b.id = c.xferdtl_id  
and b.ProdNum = d.ProdNum
and d.ProdGroup_id = e.ProdGroup_id
$where_date  
order by a.id  , b.id 


";
 
 
			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 
			
		}
  
		$this->i_report_show($table_name);	  
		  
		$this->db_sqlite = null;
	} 
	
	//////////////////////////////////////////////////////////////
   	public function sl_008(){
 		
 		$report_params=$this->report_params;
 		
 		//var_dump($report_params);
		$table_name = "rp_sl_008";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate <= '$dEnd' ";			
			

			$sql = " 

select '$company_id' as company_id, '$location_id' as location_id,
a.d_operate, 0 as c_seq,
d.ProdGroup_id, 
e.lng1_c_name as ProdGroup_lng1_c_name, e.lng2_c_name as ProdGroup_lng2_c_name, e.lng3_c_name as ProdGroup_lng3_c_name, 
d.Prod_Barcode,
b.ProdNum, d.lng1_ProdName, d.lng2_ProdName, d.lng3_ProdName,
c.lng1_OutUnit, c.lng2_OutUnit, c.lng3_OutUnit,
b.BalanceAmountUnit as Total_amount
 
from xferhdr a , xferdtl_ext c
, Product d , product_group e , xferdtl b
, (
    select max(b.id) as id
    from xferhdr a , xferdtl b
    where a.id = b.xferhdr_id
    $where_date
    group by b.ProdNum 	
) as bb

where a.id = b.xferhdr_id
and b.id = c.xferdtl_id  
and b.ProdNum = d.ProdNum
and d.ProdGroup_id = e.ProdGroup_id
and b.id = bb.id 
order by a.id  , b.id 

";
 

			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 
			
		}
  
		$this->i_report_show($table_name);	 
		  
		$this->db_sqlite = null;
	} 
		
	//////////////////////////////////////////////////////////////
   	public function sl_009(){
 		
 		$this->report_params["location_id"] = 0 ; 
 		
 		$report_params=$this->report_params;
 		
		//var_dump($report_params);
		$table_name = "rp_sl_009";
		$dt_location = $this->i_report_location($table_name);
	 
 		 
 	 	foreach($dt_location as $i1 => $r1){
			if( $this->isDebug ) echo "location_id=".$r1["id"]." name=".$r1["c_name"]." <br><br>";
			
 	 		$location_id = $r1["id"] ;
			$company_id = $r1["company_id"] ; 	 
			
					
			//ค้นหา db SQLite3			
			$this->db_sqlite = $this->get_db_sqlite($company_id,$location_id);
			
			
			//เริ่ม่อาน db และ เขียนค่า
			//var_dump($this->db_sqlite);
			
			$dStart = $report_params["Pdate"];
			$dEnd = $report_params["Pdate2"];	
			$where_date = " and a.d_operate >= '$dStart' and a.d_operate <= '$dEnd' ";			
			

			$sql = " 

select '$company_id' as company_id, '$location_id' as location_id, 
a.d_operate, 0 as c_seq,
d.ProdGroup_id, 
e.lng1_c_name as ProdGroup_lng1_c_name, e.lng2_c_name as ProdGroup_lng2_c_name, e.lng3_c_name as ProdGroup_lng3_c_name, 
d.Prod_Barcode,
b.ProdNum, d.lng1_ProdName, d.lng2_ProdName, d.lng3_ProdName ,
c.lng1_OutUnit, c.lng2_OutUnit, c.lng3_OutUnit,
sum(b.stock_out) as Used_amount
 
from xferhdr a , xferdtl_ext c
, Product d , product_group e , xferdtl b
  
where a.id = b.xferhdr_id
and b.id = c.xferdtl_id  
and b.ProdNum = d.ProdNum
and d.ProdGroup_id = e.ProdGroup_id 
  $where_date
group by a.d_operate , b.ProdNum
order by a.id  , b.id 

";
 
			$dt1 = $this->db_sqlite->i_get_rows($sql);
			if( count($dt1) == 0 ) continue;
			$this->i_Debug_table($sql,$dt1,"main sql");
			
			//insert in mysql
			foreach($dt1 as $i2=>$r2){
				$this->db_mysql->iInsert($table_name,$r2);	
			} 	 
			
		}
  
		$this->i_report_show($table_name);	 
		
		$this->db_sqlite = null;
		
	} 
	
	 
 
   
}
?>



