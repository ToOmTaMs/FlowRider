<?php
// imodule.class.php
// 2015-08-03
 
class Imodule
{
    
	////////////////////////////////////////////////////////////////// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	//////////////////////////////////////////////////////////////////  		
	
	//    http://thaimisc.pukpik.com/r/view.php?id=437&category=
	
// round()
// ฟังก์ชันแรกอ่านจากชื่อแล้ว ใครที่พอมีความรู้ด้านศัพท์ภาษาอังกฤษ หรือมีประสบการณ์ในการเขียนโปรแกรมมาก่อน ก็คงจะพอนึกออกว่ามันน่าจะเอาไว้ทำอะไร... ครับ มันมีเอาไว้เพื่อปัดเศษทศนิยมนั่นเอง
// round(ข้อมูลตัวเลข, จำนวนหน่วยทศนิยม)
//ฟังก์ชั่น round() นั้นเราสา่มารถกำหนดได้ว่าจะเอาผลลัพธ์เป็นทศนิยมกี่ตำแหน่ง และการทำงานของฟังก์ชั่นนี้ ถ้าถึง 5 จะปัดขึ้น ถ้าน้อยกว่า 5 จะปัดลง


	function RoundDown_Total($valueToRound) 
	{ 
		$floorValue = floor($valueToRound); 
		return $floorValue ; 
			
	}


	function Round2Point($valueToRound) 
	{ 
		$valueToRound = round($valueToRound , 2) ;
		return $valueToRound ;

	}

// ceil()
// คิดว่าย่อมาจาก ceiling ที่แปลว่าเพดานนั่นแหละครับ ความสามารถของฟังก์ชันนี้ก็สมกับชื่อของมันครับ คือการปัดเศษให้ติดเพดาน หรือการปัดเศษขึ้นไปเป็นจำนวนเต็มที่ใกล้ที่สุดไปเลยนั่นเอง โดยมีรูปแบบการใช้งานดังนี้
// ceil(เลขทศนิยม)


	function RoundUp($valueToRound) 
	{ 
			//valueToRound += 0.5 ;
			//double RoundUp_ = Math.Floor(valueToRound) ;
		$RoundUp_ = ceil($valueToRound) ;
		return $RoundUp_ ; 
	} 

 
// floor()
// แปลเป็นภาษาไทยก็คือ พื้น ถ้าจะให้เดาหน้าที่การทำงาน ก็คือ การปัดเศษให้ต่ำติดพื้นไปเลยนั่นเอง ซึ่งก็คือ การปัดเศษลงไปยังจำนวนเต็มใกล้เคียงที่สุดครับ มีรูปแบบการใช้งานเหมือนกับ ceil() เลยก็คือ
// floor(เลขทศนิยม)

 
	function RoundDownAll($valueToRound) 
	{ 
		$floorValue = floor($valueToRound); 
		return $floorValue ;
	}


	function RoundDown($valueToRound) 
	{ 
		$floorValue = floor($valueToRound); 
		if (($valueToRound - $floorValue) > .5) 
		{ 
			return ($floorValue + 1); 
		} 
		else 
		{ 
			return ($floorValue); 
		} 
	}
 

	function RoundUp2Point($valueToRound) 
	{ 

		$valueToRound = $valueToRound * 100 ;
		$valueToRound = floor( $valueToRound + 0.99999999 ); 
		$valueToRound = $valueToRound / 100 ;
		
		$valueToRound = $this->Round2Point($valueToRound);		
		
		return $valueToRound ;

	} 
 
	function RoundDown2Point($valueToRound) 
	{ 

		$valueToRound = $valueToRound * 100 ;


		$floorValue = floor( $valueToRound); 
		if (($valueToRound - $floorValue) > .5) 
		{ 
			$floorValue += 1 ;
			$floorValue = $floorValue / 100 ; 			
		} 
		else 
		{ 
			$floorValue = $floorValue / 100 ; 			
		} 
		
		$floorValue = $this->Round2Point($floorValue);	
		return $floorValue ; 
	}

    
	////////////////////////////////////////////////////////////////// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	//////////////////////////////////////////////////////////////////  
 
 	//function เรียงข้อมูล 
	function order_array_num($array, $key, $order = "ASC") 
	{
		$tmp = array();
		
		foreach($array as $akey => $array2)
		{
			$tmp[$akey] = $array2[$key];
		}
		
		if($order == "DESC")
		{
			arsort($tmp , SORT_NUMERIC );
		}
		else
		{
			asort($tmp , SORT_NUMERIC );
		}
 
 		$tmp2 = array();       
		foreach($tmp as $key => $value)
		{
 			$tmp2[$key] = $array[$key];
		}       
 
 		return $tmp2;
	}  
 
    
	////////////////////////////////////////////////////////////////// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////////////////////////////////////////////////////////////////// 
	 
	//เกี่ยวกับการจัดการ Sort		

	function iSort1($result_array , $key_sort)
	{
	
		$iKey = null ;
		 
		 if(count($result_array)==0)
		 	return  $result_array ;
			
		//echo "<br>\n" ;
		foreach ($result_array as $id => $row1 )
		{
			$iKey[$id] =  $row1[$key_sort]  ;
			
			//echo "\$id=$id    \$key_sort=$key_sort   value="   .$iKey[$id] ;
			//echo "<br>\n" ;
		}
		
		//echo "natcasesort";
		//echo "<br>\n" ;
		
		
		asort($iKey) ;
		
		
		$result_sort = null ;
		foreach ($iKey as $id => $row1 )
		{  
			$result_sort[] = $result_array[$id];
			//echo "\$id=$id    \$key_sort=$key_sort value="   .$row1 ;
			//echo "<br>\n" ;
		}
		
		//$this->iShowTableArray($result_sort);
		
		return $result_sort ;
		
		
		
	}
		
	function iSort1_desc($result_array , $key_sort)
	{
	
		$iKey = null ;
		 
		 if(count($result_array)==0)
		 	return  $result_array ;
			
			
		//echo "<br>\n" ;
		foreach ($result_array as $id => $row1 )
		{
			$iKey[$id] =  $row1[$key_sort]  ;
			
			//echo "\$id=$id    \$key_sort=$key_sort   value="   .$iKey[$id] ;
			//echo "<br>\n" ;
		}
		
		//echo "natcasesort";
		//echo "<br>\n" ;
		
		
		arsort($iKey) ;
		
		
		$result_sort = null ;
		foreach ($iKey as $id => $row1 )
		{  
			$result_sort[] = $result_array[$id];
			//echo "\$id=$id    \$key_sort=$key_sort value="   .$row1 ;
			//echo "<br>\n" ;
		}
		
		//$this->iShowTableArray($result_sort);
		
		return $result_sort ;
		
		
		
	} 
 
 	////////////////////////////////////////////////////////////////// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////////////////////////////////////////////////////////////////// 
	
	
	public function iconv2tis620($v1){
		$v1 = iconv("utf-8","tis-620",$v1);
		return $v1;
	}
	 public function iconv2utf8($v1){
		$v1 = iconv("tis-620","utf-8",$v1);
		return $v1;
	}
	
    public function iJson_decode($data){
    	if( $data == "" ) return [];
    	//echo "iJson_decode"; var_dump($data);
		$tmp = json_decode($data); 
		//echo "iJson_decode"; var_dump($tmp);
	  	$data1 = [];
	  	foreach($tmp as $k1 =>$v1) {
	  		$data1[$k1]=$v1;
	  	}
	  	return $data1;
	}	
 
  	////////////////////////////////////////////////////////////////// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////                                                          //// 
	////////////////////////////////////////////////////////////////// 
	
 	function add_date($givendate,$day=0,$mth=0,$yr=0) 
	{ 
		$cd = strtotime($givendate); 
		$newdate = date('Y-m-d', mktime(date('h',$cd),	 
		date('i',$cd), date('s',$cd), date('m',$cd)+$mth,	 
		date('d',$cd)+$day, date('Y',$cd)+$yr));
		 
		return $newdate; 
	}
 
}