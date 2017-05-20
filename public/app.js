import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'plugins/searchbox/../node_modules/jsonformatter/dist/json-formatter.min.js';
import 'plugins/searchbox/../node_modules/jsonformatter/dist/json-formatter.min.css';
import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';
//import autocomplete from './directives/autocomplete';

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/searchbox/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiModules
.get('app/searchbox', ['jsonFormatter'])
.controller('searchbox', ['$scope','$route','$interval','$http', function ($scope, $route, $interval, $http) {
 

  $scope.title = 'Searchbox';
  $scope.description = 'Search Resuts Helper';
  
  $scope.indexName = "cyclops-suggest" ;
  $scope.suggestField = "suggest_text";
  $scope.typeName = "t";
  $scope.fuzziness = "auto" ;
  $scope.minLength = "3" ;
  $scope.tabSelected = 0 ;
  $scope.size = 5;
  $scope.params = ["1"];

  $scope.searchQuery = '{'+
  '"query": {'+
  '"match_all": {}' +
  '}'+
'}';


  var $tabs = $('.kuiTab');
  var $selectedTab = undefined;

  if (!$tabs.length) {
    throw new Error('$tabs missing');
  }

  function selectTab(tab) {
    
    if ($selectedTab) {
      $selectedTab.removeClass('kuiTab-isSelected');
    }

    $selectedTab = $(tab);

    
    // if ($selectedTab === $tabs[0] ) {
    //   $scope.tabSelected = 0;
     
    // }  
    // else 
    //   if ($selectedTab === $tabs[1] ) {
    //     $scope.tabSelected = 1;
     
    //   }

     $selectedTab.addClass('kuiTab-isSelected');

  }

  $tabs.on('click', function (event) {
    selectTab(event.target);
    if (event.target === $tabs[0] ) {
      $scope.tabSelected = 0;
      $scope.searchBoxHint = "Search as you type terms"
     
    }  
    else 
      if (event.target === $tabs[1] ) {
        $scope.tabSelected = 1;
        $scope.searchBoxHint = "Search terms"
     
      }

    $scope.$apply() ;
  });

  selectTab($tabs[0]);




// SUGGEST
  $scope.doSuggest = function(event) {
    var isNewSearchNeeded = function(newTerm) {
        if ($scope.tabSelected == 0) {
          return newTerm.length >= $scope.minLength;
        }
        else {
          return (newTerm.length >= $scope.minLength && $scope.searchQuery != null);
        }
    }

      if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
            if (!$scope.searchStr || $scope.searchStr == "") {
                $scope.showDropdown = false;
            } 
            else if (isNewSearchNeeded($scope.searchStr)) {
              
                $scope.results = [];

              
                  $http.get("../searchbox/suggest/"+
                     $scope.indexName+"/"+
                     $scope.typeName+"/"+
                     $scope.fuzziness+"/"+
                     $scope.size+"/"+
                     $scope.suggestField+"/"+
                     $scope.searchStr).then (function (response) {
                        if (response.data.suggest && 
                              response.data.suggest.generated_phrase_suggestion &&
                                 response.data.suggest.generated_phrase_suggestion[0].options.length > 0) {
                          $scope.results = response.data.suggest.generated_phrase_suggestion[0].options;

                          $scope.showDropdown = true;
                        }
                        else {
                          $scope.showDropdown = false;
                        }

                  });
        
            }
            else {
               $scope.showDropdown = false;
            }
      }
        else {
          event.preventDefault();
        }
  }



// SEARCH
  $scope.doSearch = function(event) {
      $http({
              method: 'POST',
              url: '../searchbox/search/',
              data: {
                query:$scope.searchQuery,
                index:$scope.indexName,
                type:$scope.typeName
              }
            }).success( function(data, status, headers, config) {
        //console.log("response "+data);
        if (data != null) {
          $scope.response = data.hits;
          $scope.total = data.hits.total;
        }
        
      }).error( function(data, status, headers, config) {
      console.log("NOK");
      });
                
  }



  
}]);
