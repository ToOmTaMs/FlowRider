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
    $scope.searchMember = function() {
      $http.get('file/booking.json').then(function(res) {
        var _input = $scope.member_input;
        $scope.customer = res.data.data;
        _result = $scope.customer.filter(function(data) {
          return data.customer.cus_code == _input || data.customer.cus_name == _input || data.customer.cus_tel == _input;
        });
        console.log(_result);
        if (_result.length > 0) {
          $scope.popupFindReserve(_result);
        }
      });

    }
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

    $scope.popupFindReserve = function(_result) {

      var opt = {
        data: _result
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

    // $scope.doSomething = function (bookid) {
    //   // alert("bookid:" + bookid);
    //   _result =[];
    //   $scope.popupFindReserve(_result);
    // };

  }
]).controller('Lanes.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, $window) {

  $scope.content_height = $window.innerHeight - 150;
  alert("start at Lanes Reserve");
  console.log($scope.bookLane);

  $scope.close = function() {
    $uibModalInstance.close();
  };

}).controller('Find.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window, $http) {
  $scope.card = {};
  $scope.cards = {};
  $scope.card_order = [];
  $scope.card.card_exp = "";
  $scope.btn_card_id = "";
  $scope.content_height = $window.innerHeight - 150;
  $scope.card.methods = 1;

  var time = new Date().getTime();
  $scope.model = {
    customer: options.data[0].customer,
    cards: options.data[0].cards,
  }
  console.log($scope.model);
  $http.get('file/card_type.json').then(function(res) {
    $scope.card_type = res.data;

  });
  $http.get('file/cards.json').then(function(res) {
    $scope.cards = res.data;
  });

  // $scope.co_total = function () {


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

  $scope.co_total = function () {
    var _total = 0;
    for (var i = 0; i < $scope.card_order.length; i++) {
      var e = $scope.card_order[i];
      _total += (e.co_price * e.co_quantity);
    }
    return _total;
  }


  $scope.select_card = function(card_id) {
    _result = $scope.model.cards.filter(function(data) {
      return data.card_id == card_id;
    });
    $scope.card = _result[0];
  }
  $scope.remove_order = function(index) {
        $scope.card_order.splice(index, 1);
    }
  $scope.add_order = function(card_id) {
    _result = $scope.cards.filter(function(data) {
      return data.card_id == card_id;
    });
    var _item = {
      co_name: _result[0].card_name,
      co_quantity: 1,
      co_price: _result[0].card_price
    }
    $scope.card_order.push(_item);
  }
  $scope.close = function() {
    $uibModalInstance.close();
  };

}).controller('New.Reserve.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, bookDate, laneNo, bookLane, options) {

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

  //เมื่อกรอกข้อมูลการจอง และกดจองจะเข้า ฟังชั่นนี้
  $scope.addReserve = function() {
    //collect from data
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

    //ตรวจสอบข้อมูลเบื้องต้น
    if (reserveTimeQty > 12) {
      alert("จองได้มากที่สุด 12 ชั่วโมงเท่านั้น กรุณาแก้ไขข้อมูล");
      return;
    }

    if (reserveCustomerQty > 10) {
      alert("จองได้มากที่สุด 10 คน กรุณาแก้ไขข้อมูล");
      return;
    }

    //สร้าง object timeretmp จาก timeseriesn โดยเอาเฉพาะเวลาที่ลูกค้าเลือกจอง
    for (var i = 1; i <= reserveTimeQty; i++) {
      if (reserveTime < timeseries.length) {
        timeReTmp.push(timeseries[reserveTime]);
      }
      reserveTime++;
    }
    //console.log(timeReTmp);

  //เข็คว่าเวลาที่ลูกค้าต้องการจอง ว่างหรือไม่
    for (var j = 0; j < bookLane.length; j++) {
      for (var i = 0; i < timeReTmp.length; i++) {
        //console.log(bookLane[j][timeReTmp[i]]);
        //ตรวจสอบทีละแถว(1แถวคือ 11.00 - 22.00)
        //เช็คแต่ละชั่วโมงว่าว่างหรือไม่ และวนทำไปเรื่อยๆ ตามข้อมูลใน timeReTmp ถ้าว่าง จะเพิ่มจำนวน avaQty
        if (bookLane[j][timeReTmp[i]] == null) {
          //console.log("Ava");
          avaQty++;
        }
      }

      //เมื่อตรวจสอบเสร็จ จะเอา avaQty มาเช็คกับ reserveTimeQty(จำนวนชั่วโมงที่ลูกค้าต้องการจอง)
      //ถ้าเท่ากัน แสดงว่าในแถวนั้นว่างพอสำหรับลูกค้า ให้เก็บ index ของ bookLane เอาไว้เพิ่อเอาไปใช้ต่อ และจบ loop นี้ทันที
      if (avaQty == reserveTimeQty) {
        console.log("Ava: " + avaQty);
        dataIndex = j;
        isAvailable = true;
        break;
      } else {
        //ในกรณีที่ avaQty ไม่เท่ากับ reserveTimeQty แสดงว่าใน bookLane แถวนั้น ไม่มีเวลาว่างพอตามที่ลูกค้าอยากจอง
        //ให้ set avaQty = 0 แล้วก็จะ loop bookLane แถวถัดไปเรื่อยๆ จนกว่า avaQty จะเท่ากับ reserveTimeQty
        //แต่ถ้า loop booklane จนแถวสุดท้ายแล้ว avaQty ยังไม่เท่ากับ reserveTimeQty  แสดงว่าวันนั้นไม่มีเวลาว่างพอตามที่ลูกค้าอยากจอง
        avaQty = 0;
      }
    }

    //แจ้ง user ว่า วันนี้ม่มีเวลาว่างให้จอง ไม่สามารถจองได้
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

    //เมื่อผ่านเงื่อนไขข้างบนมาแล้ว เราจะได้ dataIndex (booklane แถวที่ว่าง)
    //เอามาตรวจสอบต่อว่า dataIndex + reserveCustomerQty จะต้องไม่เกิน 10
    //เช่น ลูกค้าจอง 11 โมง 5 คน แต่ในเวลา 11 โมงมีคนจองล่วงหน้าไปแล้ว 7 คน
    //เพราะฉนั้น ถึง booklane แถวที่ 8 จะว่าง(dataIndex = 8) แต่ก็ไม่ว่างพอสำหรับ 5 คน (8+5) > 10
    if ((Number(dataIndex) + Number(reserveCustomerQty)) > 10) {
      alert("Not Avalible");
      return;
    }

    // เมื่อผ่านเงื่อนไขทั้งหมด จะสร้าง object ก้อนการจองและเพิ่มเข้าไปใน bookLane
    for (var i = 0; i < reserveCustomerQty; i++) {
      for (var j = 0; j < timeReTmp.length; j++) {
        bookLane[dataIndex][timeReTmp[j]] = {
          "name": customerName,
          "bookCount": reserveTimeQty,
          "bookid":"555"+customerName+reserveTimeQty+reserveDate
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

}).controller('Discount.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {
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

}).controller('Discount.Note.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {

  $scope.close = function() {
    $uibModalInstance.close();
  };

}).controller('Discount.Setting.Ctrl', function($scope, $uibModalInstance, $modal, iAPI, options, $window) {
  $scope.entities = [
    {
      "card_id": 1,
      "card_name": "Flow Card",
      "card_price": 7500
    }, {
      "card_id": 2,
      "card_name": "Flow Card",
      "card_price": 7500
    }, {
      "card_id": 3,
      "card_name": "Flow Card",
      "card_price": 7500
    }
  ];
  $scope.selected = [];
  var updateSelected = function(action, id) {
    if (action == 'add' & $scope.selected.indexOf(id) == -1)
      $scope.selected.push(id);
    if (action == 'remove' && $scope.selected.indexOf(id) != -1)
      $scope.selected.splice($scope.selected.indexOf(id), 1);
    }

  $scope.updateSelection = function($event, id) {
    var checkbox = $event.target;
    var action = (checkbox.checked
      ? 'add'
      : 'remove');
    updateSelected(action, id);
  };

  $scope.selectAll = function($event) {
    var checkbox = $event.target;
    var action = (checkbox.checked
      ? 'add'
      : 'remove');
    for (var i = 0; i < $scope.entities.length; i++) {
      var entity = $scope.entities[i];
      updateSelected(action, entity.id);
    }
  };

  $scope.getSelectedClass = function(entity) {
    return $scope.isSelected(entity.id)
      ? 'selected'
      : '';
  };

  $scope.isSelected = function(id) {
    return $scope.selected.indexOf(id) >= 0;
  };

  //something extra I couldn't resist adding :)
  $scope.isSelectedAll = function() {
    return $scope.selected.length === $scope.entities.length;
  };

  $scope.close = function() {
    $uibModalInstance.close();
  };
});
