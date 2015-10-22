(function (angular) {
angular.module('shiverview')
.controller('progressCtrl', ['$scope', 'ngProgressFactory', function ($scope, ngProgressFactory) {
  $scope.bar = ngProgressFactory.createInstance();
  $scope.bar.setColor('#0091bf');
  $scope.$on('$routeChangeStart', function (e) {
    $scope.bar.reset();
    $scope.bar.start();
  });
  $scope.$on('$routeChangeSuccess', function (e) {
    $scope.bar.complete();
  });
  $scope.$on('$routeChangeError', function (e) {
    $scope.bar.reset();
  });
  $scope.$on('setProgress', function (e, arg) {
    if (arg === 0)
      $scope.bar.start();
    else if (arg >= 100)
      $scope.bar.complete();
    else if (arg < 0)
      $scope.bar.reset();
    else
      $scope.bar.set(arg);
  });
}])
.controller('bodyCtrl', ['$scope', '$location', 'archive', function ($scope, $location, archive) {
  $scope.base = new Date('2015-09-17T08:00:00.000-0700');
  $scope.sol = parseInt((Date.now() - $scope.base.getTime()) / (1000 * 60 * 60 * 24));
  $scope.index = -1;
  $scope.selectedSol = -1;
  $scope.archive = archive;
  setTimeout(function () {
    $scope.initDone = true;
  }, 10);
  $scope.findSol = function (value) {
    return $scope.archive[$scope.findSolIndex(value)];
  };
  $scope.findSolIndex = function (value) {
    for (var i = 0; i < $scope.archive.length; i++) {
      if (value >= $scope.archive[i].sol)
        return i;
    }
  };
  $scope.sliderTranslate = function (value) {
    if (value < 0)
      return 'Now';
    return 'Sol ' + $scope.findSol($scope.sol - value).sol;
  };
  $scope.go = function (direction) {
    if (direction) {
      $scope.index = $scope.index + direction;
      if ($scope.index < 0)
        $scope.selectedSol = -1;
      else {
        $location.url('/' + $scope.archive[$scope.index].sol);
        $scope.selectedSol = $scope.sol - $scope.archive[$scope.index].sol;
      }
    }
    if ($scope.selectedSol < 0) {
      $scope.index = -1;
      $location.url('/');
    } else {
      $scope.index = $scope.findSolIndex($scope.sol - $scope.selectedSol)
      $location.url('/' + $scope.archive[$scope.index].sol);
    }
  };
  if (/^\/[0-9]+$/.test($location.url())) {
    $scope.index = $scope.findSolIndex(/[0-9]+/.exec($location.url())[0]);
    $scope.selectedSol = $scope.sol - $scope.archive[$scope.index].sol;
  }
}])
.controller('viewCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.base = new Date('2015-09-17T08:00:00.000-0700');
  $scope.showContent = false;
  $scope.updateSol = function () {
    $scope.sol = parseInt((Date.now() - $scope.base.getTime()) / (1000 * 60 * 60 * 24));
    $scope.solDecimal = '.' + ('0000'+parseInt((Date.now() - $scope.base.getTime()) % (1000 * 60 * 60 * 24) / (6 * 60 * 24))).slice(-4);
  };
  $scope.fixOffset = function () {
    setTimeout(function () {
      var h = document.getElementById('content').offsetHeight;
      $scope.fix = window.innerHeight % 4 != h  % 4 && (window.innerHeight + 1) % 4 != h  % 4;
    }, 50);
  };
  $scope.updateSol();
  setInterval(function () {
    $scope.updateSol();
    $scope.$apply();
  }, 8640);
}])
.controller('navCtrl', ['$scope', '$http', '$location', '$swipe', function ($scope, $http, $location, $swipe) {
  $scope.$loc = $location;
  $scope.collapsed = true;
  $scope.toggleCollapse = function () {
    $scope.collapsed = !$scope.collapsed;
  };
  $scope.updateNav = function () {
    $http({
      url: '/routes',
      method: 'get'
    }).then(function (res) {
      if (res.data instanceof Array) {
        res.data.sort(function (a, b) {return a.index - b.index});
        $scope.navList = res.data;
      }
    });
  };
  $scope.checkActive = function (input) {
    if (typeof input === 'undefined') return false;
    return $location.path().search(input) === 0;
  };
  $scope.drawerAnimated = true;
  $scope.drawer = document.getElementById('drawer');
  var startCoords = {};
  $swipe.bind(angular.element($scope.drawer), {
    start: function (coords, e) {
      startCoords = coords;
    },
    move: function (coords, e) {
      var delta = startCoords.x - coords.x;
      if (delta > 10)
        $scope.$apply('drawerAnimated=false');
      if (delta > 0)
        $scope.drawer.style.left = '-' + (delta + Math.pow(1.5, delta/10 - 7)) + 'px';
    },
    end: function (coords, e) {
      $scope.$apply('drawerAnimated=true');
      if (startCoords.x - coords.x > 80)
        $scope.$apply('drawerActive=false');
      setTimeout(function () {
        $scope.drawer.removeAttribute('style');
      }, 200);
    }
  });
  $scope.toggleDrawer = function () {
    $scope.drawer.removeAttribute('style');
    $scope.drawerAnimated = true;
    $scope.drawerActive = !$scope.drawerActive;
  };
  $scope.updateNav();
  $scope.$on('userStatusUpdate', $scope.updateNav);
  $scope.$on('$routeChangeStart', function () {
    $scope.drawerActive = false;
  });
}])
.controller('toastCtrl', ['$scope', function ($scope) {
  $scope.show = false;
  $scope.display = function (style, msg) {
    $scope.style = style;
    $scope.message = msg;
    $scope.show = true;
  };
  $scope.dismiss = function () {
    $scope.show = false;
  };
  $scope.$on('errorMessage', function (e, msg) {
    $scope.display('alert-danger', msg);
  });
  $scope.$on('warningMessage', function (e, msg) {
    $scope.display('alert-warning', msg);
  });
  $scope.$on('infoMessage', function (e, msg) {
    $scope.display('alert-info', msg);
  });
  $scope.$on('successMessage', function (e, msg) {
    $scope.display('alert-success', msg);
  });
}])
})(window.angular);
