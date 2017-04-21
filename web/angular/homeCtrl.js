angular.module('abAPP.home', []).controller('Home.Ctrl', [
  '$scope',
  'iAPI',
  '$modal',
  function($scope, iAPI, $modal) {

    $scope.activeSide(false);

    alert("start at home");

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
    $scope.findReserve = function() {

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
    $scope.newReserve = function() {

      var opt = {
        data: "5555"
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/home/new_reserve.html',
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
  }
]).controller('Lanes.Reserve.Ctrl', function($scope, $modalInstance, $modal, iAPI, options, $window) {

  $scope.content_height = $window.innerHeight - 150;
  alert("start at Lanes Reserve");

  console.log("options", options);

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

})
