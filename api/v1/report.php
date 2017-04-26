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
    	
    	/*
    	if( $_SERVER['HTTP_HOST'] == "103.40.138.229:82" )
    		$this->url = "http://localhost:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	else if( $_SERVER['HTTP_HOST'] == "192.168.1.225" )
    		$this->url = "http://192.168.1.98:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	else $this->url = "http://139.59.230.249:8080/jasperserver/services/repository"; // << ส่วนนี้เป็นการกำหนด path ของเซิฟเวอร์ jasperserver
    	*/
    	
    	$this->url = "http://localhost:8080/jasperserver/services/repository";
    	
    	    	
		$this->username = "jasperadmin"; // << กำหนด user ของ jasperserver
		$this->password = "jasperadmin"; // << กำหนด password ของ jasperserver
		
		$sql = "select c_value from conf where c_name='jasperreports_report_folder'  ";
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
	
	public function iView_report(){
		$category = "";
		if( isset($this->params[0]) ) $category = " and category='".$this->params[0]."' ";
		$sql = "select * , type as c_type from set_report where customer='flow' and show_status='1' $category order by category ";
		$rows = $this->db_mysql->i_get_rows($sql);
		$this->send_ok($rows);
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
		
		
		$sql = "select c_value from conf where c_name='jasperreports_STOP' ";
		$program = $this->db_mysql->i_get_field($sql);
		//echo $program;
		
		//echo exec('whoami');

		$output = exec($program) ;
		//var_dump($output);
		
		$this->send_ok(true);
	}
	public function jasper_start() {
		
		$sql = "select c_value from conf where c_name='jasperreports_START' ";
		$program = $this->db_mysql->i_get_field($sql);
		//echo $program;
		
		$output = exec($program) ;
		//var_dump($output);		
		
		$this->send_ok(true);
	 
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



	
	 
 
   
}
?>



