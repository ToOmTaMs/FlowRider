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
          $scope.bookLane.push({});

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
    var reserveTime = $('#reserve-time').val();
    var reserveTimeQty = $('#reserve-time-qty').val();
    var reserveCustomerQty = $('#reserve-customer-qty').val();
    var dataIndex = 0;
    var isAvailable = false;
    if(bookLane.length == undefined){
      bookLane = [{
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
                  }];
    }else{
      for(var i =0;i<bookLane.length;i++){
        console.log(bookLane[i]);
        if(bookLane[i]["T"+reserveTime] == null){
          dataIndex = i;
          isAvailable = true;
          break;
        }
      }

      if(!isAvailable){
        dataIndex = bookLane.length;
        bookLane[dataIndex] = {
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
                  };
      }
    }

    var laneObj = {};

    var time = "T"+reserveTime;
    var retObj = {};
    retObj.date = reserveDate;
    retObj.lane = laneNo;
    var reserveData = bookLane;
    var tmpReserveData = {};

    switch(reserveTime) {
    case "1100":
        bookLane[dataIndex].T1100 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1200":
        bookLane[dataIndex].T1200 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1300":
        bookLane[dataIndex].T1300 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1400":
        bookLane[dataIndex].T1400 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1500":
        bookLane[dataIndex].T1500 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1600":
        bookLane[dataIndex].T1600 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1700":
        bookLane[dataIndex].T1700 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1800":
        bookLane[dataIndex].T1800 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "1900":
        bookLane[dataIndex].T1900 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "2000":
        bookLane[dataIndex].T2000 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "2100":
        bookLane[dataIndex].T2100 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    case "2200":
        bookLane[dataIndex].T2200 = {"name":customerName,"bookCount":reserveTimeQty};
        break;
    default:
        break;
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
    $uibModalInstance.close("555555555");
  };

});

