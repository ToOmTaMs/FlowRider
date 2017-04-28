angular.module('abAPP.home', []).controller('Home.Ctrl', [
  '$scope',
  'iAPI',
  '$modal',
  '$http',
  '$window',
  '$location',
  function($scope, iAPI, $modal, $http, $window, $location) {

    ///////////////////////////////////////////////////////////////
    //2017-04-26 ngearb
    //div height
    $scope.optHeight = {
      div_payment_height: $window.innerHeight - 440,
      div_payment_dtl_height: $window.innerHeight - 440 - 150,
      div_lanes_time_height: $window.innerHeight - 260
    }
    $scope.conf = {};
    $scope.MODEL = {
      time: [
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21;00",
        "22:00"
      ]
    };

    $scope.loadPage = function() {

      iAPI.post('flow.iView_lanes/normal', {}).then(function(res) {
        //console.log("flow.iView_lanes",res.data);
        $scope.MODEL['lanes'] = res.data;
        console.log("flow.iView_lanes", $scope.MODEL['lanes']);
      });

      iAPI.post('flow.iView_agent/normal', {}).then(function(res) {
        //console.log("flow.iView_lanes",res.data);
        $scope.MODEL['agent'] = res.data;
        console.log("flow.iView_agent", $scope.MODEL['agent']);
      });

      //getConf
      iAPI.post('fr.iViewAll_conf', {}).then(function(res) {
        console.log("fr.iViewAll_conf", res.data);
        $scope.conf = res.data;
      });

    }

    $scope.getBookingAllLane = function() {
      var d_booking = $scope.convertDate($scope.bookDate);
      iAPI.post('flow.iView_lane_booking_hdr_all_lane', {}).then(function(res) {
        console.log("fr.iView_lane_booking_hdr_all_lane", res.data);
        $scope.BookingAllLane = res.data;
      });
    }
    $scope.loadPage();

    ///////////////////////////////////////////////////////////////
    //action

    $scope.activeSide(false);
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth() + 1;
    m = m > 9
      ? m
      : "0" + m;
    var y = date.getFullYear();
    $scope.bookDate = d + "/" + m + "/" + y

    $('#bookDate').datepicker({format: "dd/mm/yyyy", autoclose: true});

    //initial json data
    $scope.dataDisplay = null;
    $scope.jsonResult = null;
    $scope.initeJSON = function() {
      $http.get('file/test.json').then(function(res) {
        $scope.jsonResult = res.data.data;
        $scope.getDataByLane(1);
      });
    }

    $scope.setCurrentDate = function() {
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth() + 1;
      m = m > 9
        ? m
        : "0" + m;
      var y = date.getFullYear();
      $scope.bookDate = d + "/" + m + "/" + y

      $('#bookDate').datepicker({format: "dd/mm/yyyy", autoclose: true});
    }

    $scope.getBookingAllLane();

    $scope.getDataByLane = function(laneNo) {
      //console.log($scope.bookDate+" getDataByLane"+laneNo);
      //console.log($scope.jsonResult);
      $scope.laneNo = laneNo;
      $scope.bookLane = {};
      for (i in $scope.jsonResult) {
        var resBookDate = ($scope.jsonResult[i]["date"]);
        var resLane = $scope.jsonResult[i]["lane"];
        //console.log(resBookDate);
        if (resBookDate == $scope.bookDate && resLane == laneNo) {
          $scope.bookLane = $scope.jsonResult[i]["bookTime"];
        }
        //console.log($scope.bookLane.length);
        while ($scope.bookLane.length < 10 || $scope.bookLane.length == undefined) {
          if ($scope.bookLane.length == undefined) {
            $scope.bookLane = [];
            //console.log($scope.bookLane);
          }
          $scope.bookLane.push({
            "T1100": null,
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

    ///////////////////////////////////////////////////////////////
    //popup

    $scope.showPopup = function() {

      var opt = {
        MODEL: $scope.MODEL
      }

      var time = new Date().getTime();
      var modalInstance = $modal.open({
        templateUrl: 'views/home/lanes_reserve.html?ver=' + time,
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
      var time = new Date().getTime();
      var modalInstance = $modal.open({
        templateUrl: 'views/home/find_reserve.html?ver=' + time,
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
        MODEL: $scope.MODEL,
        d_booking: $scope.convertDate($scope.bookDate), // "2017-04-26",
        lane_id: $scope.laneNo
      }
      var time = new Date().getTime();
      var modalInstance = $modal.open({
        templateUrl: 'views/home/new_reserve.html?ver=' + time,
        controller: 'New.Reserve.Ctrl',
        size: 'xs',
        resolve: {
          bookDate: function() {
            return $scope.bookDate;
          },
          laneNo: function() {
            return $scope.laneNo;
          },
          bookLane: function() {
            return $scope.bookLane;
          },
          options: function() {
            return opt;
          }
        }
      });
      modalInstance.result.then(function(data) {
        console.log("Calose modal:" + data);
        $scope.jsonResult.push(data);
        $scope.getDataByLane($scope.laneNo);
      });

    };

    $scope.popupDiscount = function() {

      var opt = {
        data: "5555"
      }

      var time = new Date().getTime();
      var modalInstance = $modal.open({
        templateUrl: 'views/home/discount.html?ver=' + time,
        controller: 'Discount.Ctrl',
        size: 'xs',
        resolve: {
          options: function() {
            return opt;
          }
        }
      });
      modalInstance.result.then(function() {});

    };

  }
]).controller('Lanes.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, $window) {

  $scope.content_height = $window.innerHeight - 150;
  alert("start at Lanes Reserve");
  console.log($scope.bookLane);

  $scope.close = function() {
    $uibModalInstance.close();
  };

})
.controller('Find.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {

  $scope.content_height = $window.innerHeight - 150;
  // alert("start at Lanes Reserve");
  //
  // console.log("options", options);

  var time = new Date().getTime();
  $scope.tabs = [
    {
      title: 'บัตรสมาชิก',
      templateUrl: 'views/home/reserve_tabs/card.html?ver=' + time
    }, {
      title: 'Agent',
      templateUrl: 'views/home/reserve_tabs/agent.html?ver=' + time
    }, {
      title: 'รายครั้ง',
      templateUrl: 'views/home/reserve_tabs/walkin.html?ver=' + time
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
    $uibModalInstance.close();
  };

})
.controller('New.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, bookDate, laneNo, bookLane, options) {

  console.log(bookLane);

  //2017-04-26 ngearb
  $scope.options = options;
  console.log("MODEL", $scope.options.MODEL);

  $scope.addItems = function() {

    $scope.row = {};
    $scope.row.c_type = 'member';
    $scope.row.lane_id = $scope.options.lane_id;
    $scope.row.d_booking = $scope.options.d_booking;
    $scope.row.agent_id = $scope.options.MODEL['agent'][0].agent_id;

  }

  $scope.addItems();

  $scope.saveRow = function() {

    if ($scope.row.c_type == 'member')
      $scope.row.agent_id = 0;
    $scope.row.d_booking_time = $scope.options.MODEL['time'][$scope.row.reserveTime];

    console.log("saveRow", $scope.row);
    iAPI.post('flow.iInsert_lane_booking_hdr', $scope.row).then(function(res) {

      console.log("flow.iInsert_lane_booking_hdr", res.data);
    });

  }

  var timeseries = [
    "T1100",
    "T1200",
    "T1300",
    "T1400",
    "T1500",
    "T1600",
    "T1700",
    "T1800",
    "T1900",
    "T2000",
    "T2100",
    "T2200"
  ];

  $scope.bookDate = bookDate;
  $scope.laneNo = laneNo;
  $('#bookDate').datepicker({format: "dd/mm/yyyy", autoclose: true});

  $scope.addReserve = function() {
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

    if (reserveTimeQty > 12) {
      alert("จองได้มากที่สุด 12 ชั่วโมงเท่านั้น กรุณาแก้ไขข้อมูล");
      return;
    }

    if (reserveCustomerQty > 10) {
      alert("จองได้มากที่สุด 10 คน กรุณาแก้ไขข้อมูล");
      return;
    }

    for (var i = 1; i <= reserveTimeQty; i++) {
      if (reserveTime < timeseries.length) {
        timeReTmp.push(timeseries[reserveTime]);
      }
      reserveTime++;
    }
    //console.log(timeReTmp);

    for (var j = 0; j < bookLane.length; j++) {
      for (var i = 0; i < timeReTmp.length; i++) {
        //console.log(bookLane[j][timeReTmp[i]]);
        if (bookLane[j][timeReTmp[i]] == null) {
          //console.log("Ava");
          avaQty++;
        }
      }
      if (avaQty == reserveTimeQty) {
        console.log("Ava: " + avaQty);
        dataIndex = j;
        isAvailable = true;
        break;
      } else {
        avaQty = 0;
      }
    }

    if (!isAvailable) {
      alert("Not Avalible");
      return;
    }

    var laneObj = {};

    var time = "T" + reserveTime;
    var retObj = {};
    retObj.date = reserveDate;
    retObj.lane = laneNo;
    var reserveData = bookLane;
    var tmpReserveData = {};

    if ((Number(dataIndex) + Number(reserveCustomerQty)) > 10) {
      alert("Not Avalible");
      return;
    }

    for (var i = 0; i < reserveCustomerQty; i++) {
      for (var j = 0; j < timeReTmp.length; j++) {
        bookLane[dataIndex][timeReTmp[j]] = {
          "name": customerName,
          "bookCount": reserveTimeQty
        };
      }
      dataIndex++;
    }

    $scope.saveRow();

    //reserveData.push(tmpReserveData);

    retObj.bookTime = bookLane;
    console.log(bookLane);
    $uibModalInstance.close(retObj);
  }

  $scope.close = function() {
    $uibModalInstance.close();
  };

})
.controller('Discount.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {
  var opt = {
    data: "5555"
  }
  $scope.popupDiscountNote = function() {
    var time = new Date().getTime();
    var modalInstance = $modal.open({
      templateUrl: 'views/home/discount_note.html?ver=' + time,
      controller: 'Discount.Note.Ctrl',
      size: 'xs',
      resolve: {
        options: function() {
          return opt;
        }
      }
    });
    modalInstance.result.then(function() {});

  };
  $scope.popupDiscountNote = function() {
    var time = new Date().getTime();
    var modalInstance = $modal.open({
      templateUrl: 'views/home/dicount_options/discount_note.html?ver=' + time,
      controller: 'Discount.Note.Ctrl',
      size: 'xs',
      resolve: {
        options: function() {
          return opt;
        }
      }
    });
    modalInstance.result.then(function() {});

  };
  $scope.popupDiscountSetting = function() {
    var time = new Date().getTime();
    var modalInstance = $modal.open({
      templateUrl: 'views/home/dicount_options/discount_setting.html?ver=' + time,
      controller: 'Discount.Setting.Ctrl',
      size: 'xs',
      resolve: {
        options: function() {
          return opt;
        }
      }
    });
    modalInstance.result.then(function() {});

  };
  $scope.popupDiscountConfirm = function() {
    var time = new Date().getTime();
    var modalInstance = $modal.open({
      templateUrl: 'views/home/dicount_options/discount_confirm.html?ver=' + time,
      controller: 'Discount.Note.Ctrl',
      size: 'xs',
      resolve: {
        options: function() {
          return opt;
        }
      }
    });
    modalInstance.result.then(function() {});

  };
  $scope.close = function() {
    $uibModalInstance.close();
  };

})
.controller('Discount.Note.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {

  $scope.close = function() {
    $uibModalInstance.close();
  };

})
.controller('Discount.Setting.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {
  $scope.entities = [{
      "title": "foo",
      "id": 1
  }, {
      "title": "bar",
      "id": 2
  }, {
      "title": "baz",
      "id": 3
  }];
  $scope.selected = [];
  var updateSelected = function (action, id) {
      if (action == 'add' & $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
      if (action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
  }

  $scope.updateSelection = function ($event, id) {
      var checkbox = $event.target;
      var action = (checkbox.checked ? 'add' : 'remove');
      updateSelected(action, id);
  };

  $scope.selectAll = function ($event) {
      var checkbox = $event.target;
      var action = (checkbox.checked ? 'add' : 'remove');
      for (var i = 0; i < $scope.entities.length; i++) {
          var entity = $scope.entities[i];
          updateSelected(action, entity.id);
      }
  };

  $scope.getSelectedClass = function (entity) {
      return $scope.isSelected(entity.id) ? 'selected' : '';
  };

  $scope.isSelected = function (id) {
      return $scope.selected.indexOf(id) >= 0;
  };

  //something extra I couldn't resist adding :)
  $scope.isSelectedAll = function () {
      return $scope.selected.length === $scope.entities.length;
  };

  $scope.close = function() {
    $uibModalInstance.close();
  };
});
