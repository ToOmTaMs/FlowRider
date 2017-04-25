angular.module('abAPP.home', []).controller('Home.Ctrl', [
  '$scope',
  'iAPI',
  '$modal',
  '$http',
  function($scope, iAPI, $modal,$http) {

    $scope.activeSide(false);
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth()+1;
    m = m>9 ? m: "0"+m;
    var y = date.getFullYear();
    $scope.bookDate=d+"/"+m+"/"+y

    $('#bookDate').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    });

    //initial json data
    $scope.dataDisplay = null; 
    $scope.jsonResult = null;
    $scope.initeJSON = function(){
          $http.get('file/test.json')
        .then(function(res){
          $scope.jsonResult = res.data.data; 
          $scope.getDataByLane(1);   
      });
    }

    $scope.setCurrentDate = function(){
          var date = new Date();
          var d = date.getDate();
          var m = date.getMonth()+1;
          m = m>9 ? m: "0"+m;
          var y = date.getFullYear();
          $scope.bookDate=d+"/"+m+"/"+y

          $('#bookDate').datepicker({
            format: "dd/mm/yyyy",
            autoclose: true
          });
    }

    $scope.showPopup = function() {

      var opt = {
        data: "5555"
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/home/lanes_reserve.html',
        controller: 'Lanes.Reserve.Ctrl',
        size: 'lg',
        resolve: {
          options: function() {
            return opt;
          }
        }
      });
      modalInstance.result.then(function() {});

    };
    $scope.popupFindReserve = function() {

      var opt = {
        data: "5555"
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/home/find_reserve.html',
        controller: 'Find.Reserve.Ctrl',
        size: 'lg',
        resolve: {
          options: function() {
            return opt;
          }
        }
      });
      modalInstance.result.then(function() {});

    };
    $scope.popupNewReserve = function() {

      var opt = {
        data: "5555"
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/home/new_reserve.html',
        controller: 'New.Reserve.Ctrl',
        size: 'xs',
        resolve: {
          bookDate: function() {
            return $scope.bookDate;
          },
          laneNo: function(){
            return $scope.laneNo;
          },
          bookLane: function(){
            return $scope.bookLane;
          }
        }
      });
      modalInstance.result.then(function(data) {
        console.log("Calose modal:"+data);
        $scope.jsonResult.push(data);
        $scope.getDataByLane($scope.laneNo); 
      });

    };
    $scope.popupDiscount = function() {

      var opt = {
        data: "5555"
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/home/discount.html',
        controller: 'Find.Reserve.Ctrl',
        size: 'xs',
        resolve: {
          options: function() {
            return opt;
          }
        }
      });
      modalInstance.result.then(function() {});

    };

    $scope.getDataByLane = function(laneNo){
      //console.log($scope.bookDate+" getDataByLane"+laneNo);
      //console.log($scope.jsonResult);
      $scope.laneNo = laneNo;
      $scope.bookLane = {};
      for(i in $scope.jsonResult){
        var resBookDate = ($scope.jsonResult[i]["date"]);
        var resLane = $scope.jsonResult[i]["lane"];
        //console.log(resBookDate);
        if(resBookDate == $scope.bookDate && resLane == laneNo){
            $scope.bookLane = $scope.jsonResult[i]["bookTime"];
        }
        //console.log($scope.bookLane.length);
        while($scope.bookLane.length < 10 || $scope.bookLane.length == undefined){
          if($scope.bookLane.length == undefined){
              $scope.bookLane = [];
              //console.log($scope.bookLane);
          }
          $scope.bookLane.push({
                   "T1100": null ,
                   "T1200": null,
                   "T1300": null,
                   "T1400": null,
                   "T1500": null,
                   "T1600": null,
                   "T1700": null,
                   "T1800": null,
                   "T1900": null,
                   "T2000": null,
                   "T2100": null,
                   "T2200": null
                  });

        }

      }
    };
    
  }
]).controller('Lanes.Reserve.Ctrl', function($scope, $modalInstance, $modal, iAPI, $window) {

  $scope.content_height = $window.innerHeight - 150;
  alert("start at Lanes Reserve");
  console.log($scope.bookLane);

  $scope.close = function() {
    $modalInstance.close();
  };

}).controller('Find.Reserve.Ctrl', function($scope, $modalInstance, $modal, iAPI, options, $window) {

  $scope.content_height = $window.innerHeight - 150;
  // alert("start at Lanes Reserve");
  //
  // console.log("options", options);
  $scope.tabs = [
    {
      title: 'บัตรสมาชิก',
      templateUrl: 'views/home/reserve_tabs/card.html'
    }, {
      title: 'Agent',
      templateUrl: 'views/home/reserve_tabs/agent.html'
    }, {
      title: 'รายครั้ง',
      templateUrl: 'views/home/reserve_tabs/walkin.html'
    }
  ];
  $scope.cards = [
    {
      id: '1',
      title: 'บัตรสมาชิก',
      max: '10',
      balance: '3',
      exp: '20/04/2017'
    }, {
      id: '2',
      title: 'บัตรสมาชิก',
      max: '10',
      balance: '9',
      exp: '20/04/2017'
    }
  ];
  $scope.card = {};
  $scope.card.methods = 1;
  $scope.close = function() {
    $modalInstance.close();
  };

}).controller('New.Reserve.Ctrl', function($scope, $modalInstance, $modal, iAPI, bookDate, laneNo,bookLane,  $uibModalInstance) {
    
    console.log(bookLane);

    var timeseries = ["T1100","T1200","T1300","T1400","T1500","T1600","T1700","T1800","T1900","T2000","T2100","T2200"];

    $scope.bookDate = bookDate;
    $scope.laneNo = laneNo;
    $('#bookDate').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    });
  $scope.addReserve = function(){
    var customerName = $('#customer-name').val();
    var customerTel = $('#customer-tel').val();
    var reserveDate = $('#reserve-date').val();
    var reserveTime = 0;
    var reserveTime = Number($('#reserve-time').val());
    var reserveTimeQty = Number($('#reserve-time-qty').val());
    var reserveCustomerQty = $('#reserve-customer-qty').val();
    var dataIndex = 0;
    var timeReTmp = [];
    var avaQty = 0;
    var isAvailable = false;

    if(reserveTimeQty > 12 ){
      alert("จองได้มากที่สุด 12 ชั่วโมงเท่านั้น กรุณาแก้ไขข้อมูล");
      return;
    }

    if(reserveCustomerQty > 10){
       alert("จองได้มากที่สุด 10 คน กรุณาแก้ไขข้อมูล");
       return;
    }

    for(var i=1 ; i<=reserveTimeQty ; i++){
      if(reserveTime < timeseries.length){
        timeReTmp.push(timeseries[reserveTime]);
      }
      reserveTime++;
    }
    //console.log(timeReTmp);
    
    for(var j = 0 ; j < bookLane.length ; j++){
      for(var i =0 ; i<timeReTmp.length; i++){
        //console.log(bookLane[j][timeReTmp[i]]);
        if(bookLane[j][timeReTmp[i]] == null){
            //console.log("Ava");
            avaQty++;
        }
      }
      if(avaQty == reserveTimeQty){
          console.log("Ava: "+avaQty);
          dataIndex = j;
          isAvailable = true;
          break;
      }else{
        avaQty = 0;
      }
    }

    if(!isAvailable){
      alert("Not Avalible");
      return;
    }


    var laneObj = {};

    var time = "T"+reserveTime;
    var retObj = {};
    retObj.date = reserveDate;
    retObj.lane = laneNo;
    var reserveData = bookLane;
    var tmpReserveData = {};

    if((Number(dataIndex)+Number(reserveCustomerQty)) > 10){
      alert("Not Avalible");
      return;
    }

    for(var i=0; i<reserveCustomerQty; i++){
      for(var j =0 ; j<timeReTmp.length; j++){
        bookLane[dataIndex][timeReTmp[j]] = {"name":customerName,"bookCount":reserveTimeQty};
      }
      dataIndex++;
    }


    //reserveData.push(tmpReserveData);

    retObj.bookTime = bookLane;
    console.log(bookLane);
    $uibModalInstance.close(retObj);
  }

  $scope.close = function() {
    $modalInstance.close();
  };
  $scope.ok = function () {
    $modalInstance.close();
  };

});

