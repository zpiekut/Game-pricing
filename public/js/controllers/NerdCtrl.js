angular.module('NerdCtrl', [])

.controller('NerdController', ['$scope', '$http',
  function($scope, $http) {
  	
  	$scope.games = [];
    $scope.searchGames = [];
    getUser();
    function getUser() {
      $http.get('/api/users/54fe2ca6da3d157c08267d7e')
        .success(function(data) {
          //alert(data.games[0]._game['title']);
          $scope.user = data;
          $scope.games = data.games;
        });
    }

  	function totalPrice() {
      var totalNumber = 0;
      for(var ii=0; ii<$scope.games.length; ii++){
        if($scope.games[ii]['user_price'] >= 0) {
          totalNumber = totalNumber + parseFloat( $scope.games[ii]['user_price'] );
        }
      }
      return (totalNumber);
    }

    $scope.testTotal = function(game) {
      $scope.totalPrice = totalPrice();
    }

    $scope.changePrice = function(game) {
      if(game.isCIB == false)
        game.user_price = game._game.loose_price;
      else
        game.user_price = game._game.cib_price;
      $http.put('/api/users/54fe2ca6da3d157c08267d7e/1/'+game._game._id+'/1', {isCIB: game.isCIB, user_price: game.user_price})
        .success(function(data, status, headers, config) {
          
        })
        .error(function(data, status, headers, config) {  
          alert(data);
        });
    }

    $scope.searchForCards = function(searchQuery) {
      //$http.get('https://ae.pricecharting.com/api/product?t=19c5c6d91fc7ec04c57096532e399f283f21580b&q='+searchQuery)
      $http.get('/api/search/'+searchQuery)
        .success(function(data) {
        	// $scope.games = data;
          //This is probably not necessary and can be removed
          //reminder to test results of empty return though
        	if( $scope.games.length == 0 ) {
        		$scope.searchGames = data;
            //$scope.games = data.concat($scope.games);
            //alert("No Results");
        	} else {
            $scope.searchGames = data;
  			    //$scope.games = data.concat($scope.games);
        	}
        	//$scope.totalPrice = totalPrice();
        	$scope.totalCards = $scope.games.length;
        });
    }

    $scope.remove = function(item) { 
      var index = $scope.games.indexOf(item);   
      //$httpProvider.defaults.headers.common.Content-Type = 'application/x-www-form-urlencoded';
      $http.delete('/api/users/54fe2ca6da3d157c08267d7e/1/'+item._game._id+'/1')
        .success(function(data, status, headers, config) {
          $scope.games.splice(index, 1);
        })
        .error(function(data, status, headers, config) {  
          alert(data);
        });
	  }

    $scope.add = function(item) { 
      alert(item);
      item.user_price = item.cib_price;
      item.isCIB = true;
      $http.put('/api/users/54fe2ca6da3d157c08267d7e', {game: item} )
        .success(function(data, status, headers, config) {
          //alert(data._game.title);
          item._game = data;
          $scope.games.unshift(item);
        })
        .error(function(data, status, headers, config) {  
          alert(data);
        });
    }

    $scope.logout = function() {
      $http.get('/logout')
        .success(function(data) {

        });
    }

    $scope.mySortFunction = function(item) {
      if(isNaN(item[$scope.sortExpression]))
        return item[$scope.sortExpression];
      return parseInt(item[$scope.sortExpression]);
    }

    // $scope.status = {
    //   isopen: false
    // };

    // $scope.toggled = function(open) {
    //   $log.log('Dropdown is now: ', open);
    // };

    // $scope.toggleDropdown = function($event) {
    //   $event.preventDefault();
    //   $event.stopPropagation();
    //   $scope.status.isopen = !$scope.status.isopen;
    // };

    $scope.$watch('games', function() {
      //alert("watch triggered");
      $scope.totalWatchPrice = totalPrice();
    },true);

    $scope.sortExpression = 'title';
  }
]);