 

function strPad(i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
};

    $("input[type='checkbox'], input[type='radio']").iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal'
    });

function isset()
{
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: FremyCompany
    // +   improved by: Onno Marsman
    // +   improved by: Rafa? Kukawski
    // *     example 1: isset( undefined, true);
    // *     returns 1: false
    // *     example 2: isset( 'Kevin van Zonneveld' );
    // *     returns 2: true

  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if (l === 0)
  {
    throw new Error('Empty isset');
  }

  while (i !== l)
  {
    if (a[i] === undef || a[i] === null)
    {
      return false;
    }
    i++;
  }
  return true;
}



function i_dNow(strDate){
	var dNow = new Date();	
	
	if(strDate!=""&&strDate!=null){
		dNow =  new Date(strDate);
		//alert(strDate);
	}
	var now_year = dNow.getFullYear();	 
	
	var now_month = dNow.getMonth()+1;
	now_month = ("00" + now_month).substr(-2)
	
	var now_date = dNow.getDate() ;
	now_date = ("00" +now_date).substr(-2);
	
	var dNow1 = now_year+"-"+ now_month +"-"+now_date;	 
	return dNow1 ;
}



