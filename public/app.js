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
.filter("trust",['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
.controller('searchbox', ['$scope','$route','$interval','$http', function ($scope, $route, $interval, $http) {
 

  $scope.title = 'Searchbox';
  $scope.description = 'Search Resuts Helper';
  
  $scope.indexName = "" ;
  $scope.suggestField = "";
  $scope.typeName = "";
  $scope.fuzziness = "auto" ;
  $scope.minLength = "3" ;
  $scope.tabSelected = 0 ;
  $scope.searchTabSelected = 0 ;
  $scope.pageSize = 10;
  $scope.resPerPage = 10;
  $scope.pageNumber = 0;
  $scope.params = [];  
  $scope.apiError = false;

  $scope.searchQuery = '{'+
  '"query": {'+
  '"match_all": {}' +
  '}'+
'}';

  // params for Search tab
  var anItem = {"item":"","tayg":false,"num":0};
  $scope.params.push(anItem);


  $scope.analyze = {"tayg":false,"text":""};


  // init tabs  
  var $selectedSearchTab  = $('.kuiTab');
  var $selectedTab = $('.kuiTab');
  $scope.selectedTab = 0;
  $scope.searchBoxHint = "Type search terms ...";

  
// SUGGEST type as you go
// TODO change it to a POST
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
                     $scope.pageSize+"/"+
                     $scope.suggestField+"/"+
                     $scope.searchStr).then (function (response) {
                        if (response.data.suggest && 
                              response.data.suggest.suggestions &&
                                 response.data.suggest.suggestions[0].options.length > 0) {
                          $scope.results = response.data.suggest.suggestions[0].options;

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


// TAYG
 $scope.doTayg = function(event,paramNum) {

  
    var isNewSearchNeeded = function(newTerm) {
          return newTerm.length >= 3;
    }
  
    if (!$scope.params[paramNum].tayg) {
      $scope.iterSuggesters = [];
      return
    }

    var searchQueryReplaced = (' ' + $scope.searchQuery).slice(1);


    for (var i =0 ; i< $scope.params.length;i++) {
      var param = $scope.params[i].item;
      if (param != null && param != "") {
        // replace @i by param
        searchQueryReplaced = searchQueryReplaced.replace('@'+i, param);
      }
    }

    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
            if (!$scope.params[paramNum].item || $scope.params[paramNum].item == "") {
                $scope.iterSuggesters = [];
                return;
            } 
            else if (isNewSearchNeeded($scope.params[paramNum].item)) {
              sendSearch(searchQueryReplaced);
            }
            else {
              $scope.iterSuggesters = [];
            }
    }
 }

// SEARCH
 $scope.doSearch = function() {
      
      // clone the searchquery
      var searchQueryReplaced = (' ' + $scope.searchQuery).slice(1);

      for (var i =0 ; i< $scope.params.length;i++) {
        var param = $scope.params[i].item;
        if (param != null && param != "") {
          // replace @i by param
          searchQueryReplaced = searchQueryReplaced.replace('@'+i, param);
        }
      }

      sendSearch(searchQueryReplaced);
 }

 // Analyze
  $scope.doAnalyzeSearch = function() {
      if ($scope.analyzer == null || $scope.analyzer == "") {
        $scope.analyzer = "standard";
      }


       $http({
          method: 'POST',
          url: '../searchbox/analyze/',
          data: {
            index:$scope.indexName,
            text:$scope.analyze.text,
            analyzer:$scope.analyzer
          }
        }).success( function(data, status, headers, config) {
          $scope.apiError = false;
           console.log("OK");
            //console.log("response "+data);
            if (data != null) {

              for (var i=0; i< data.tokens;i++) {

              }
               $scope.highlighted = $scope.analyze.text;

               $scope.results = data.tokens;
               $scope.showDropdown = true;
              

            }
            
          }).error( function(data, status, headers, config) {
            console.log("NOK");
            $scope.apiError = true;
            $scope.showDropdown = false;
        });
   

 }


 $scope.nextPage = function(event) {
      
     $scope.pageNumber++;
     $scope.doSearch();
    
 }


 $scope.prevPage = function(event) {
    
     if ($scope.pageNumber == 0) {
      return;
     }
     $scope.pageNumber--;
     $scope.doSearch();    
 }


// TODO increment the 
 $scope.addParam = function(searchParam) {
  var index = searchParam.num;
  
  var newParam = {"item":"","tayg":false,"num":index};
  $scope.params.splice(index+1, 0, newParam);
  for (var i = index+1 ; i < $scope.params.length;i++) {
    $scope.params[i].num++;
  }
 }


 // TODO increment the 
 $scope.removeParam = function(searchParam) {
  var index = searchParam.num;
  
  $scope.params.pop(index);
  for (var i = index ; i < $scope.params.length;i++) {
    $scope.params[i].num--;
  }
 }


// Main Tabs selection
$scope.seeAutocompleteTab = function(event) {
  if ($selectedTab) {
      $selectedTab.removeClass('kuiTab-isSelected');
    }
    $scope.selectedTab = 0;
    $selectedTab = $(event.target);
    $selectedTab.addClass('kuiTab-isSelected');
    $scope.searchBoxHint = "Type search terms ...";
              
 }

 $scope.seeCustomSearchTab = function(event) {
  if ($selectedTab) {
      $selectedTab.removeClass('kuiTab-isSelected');
    }

    $scope.selectedTab = 1;
    $selectedTab = $(event.target);
    $selectedTab.addClass('kuiTab-isSelected');
   
 }


 $scope.seeAnalysisTab = function(event) {
  if ($selectedTab) {
      $selectedTab.removeClass('kuiTab-isSelected');
    }

    $scope.selectedTab = 2;
    $selectedTab = $(event.target);
    $selectedTab.addClass('kuiTab-isSelected');
    $scope.searchBoxHint = "Enter text to analyze here ..";
   
 }

 
// Suggests results / Search Results
$scope.seeHitsTab = function(event) {
  if ($selectedSearchTab) {
      $selectedSearchTab.removeClass('kuiTab-isSelected');
    }
    $scope.searchTabSelected = 0;
    $selectedSearchTab = $(event.target);
    $selectedSearchTab.addClass('kuiTab-isSelected'); 
         
 }

 $scope.seeSuggestTab = function(event) {
  if ($selectedSearchTab) {
      $selectedSearchTab.removeClass('kuiTab-isSelected');
    }

    $scope.searchTabSelected = 1;
    $selectedSearchTab = $(event.target);
    $selectedSearchTab.addClass('kuiTab-isSelected');
        
 }



  var sendSearch = function(qry) {

    $http({
          method: 'POST',
          url: '../searchbox/search/',
          data: {
            query:qry,
            index:$scope.indexName,
            type:$scope.typeName,
            pageSize:$scope.resPerPage,
            pageNumber:$scope.pageNumber
          }
        }).success( function(data, status, headers, config) {
          $scope.apiError = false;
            //console.log("response "+data);
            if (data != null) {
              $scope.response = data.hits;
              $scope.suggest = data.suggest;
              $scope.total = data.hits.total;

              if ($scope.suggest != null) {
                $scope.iterSuggesters = [];
                for (var key in $scope.suggest) {
                  if ($scope.suggest.hasOwnProperty(key)  ) {
                    if ($scope.suggest[key].constructor === Array) {

                      for (var j=0; j< $scope.suggest[key][0].options.length;j++) {
                        if ($scope.suggest[key][0].options[j].hasOwnProperty("highlighted")) {
                          $scope.suggest[key][0].options[j].show = $scope.suggest[key][0].options[j].highlighted;
                        }
                        else {
                          $scope.suggest[key][0].options[j].show = $scope.suggest[key][0].options[j].text;
                        }
                      } 
                      var aGroup = {
                        name:key,
                        options:$scope.suggest[key][0].options
                      }
                      $scope.iterSuggesters.push(aGroup);
                      
                    }
                    // console.log(key + " -> " +  $scope.suggest[key]);
                    // console.log($scope.suggest[key].constructor === Array);
                  }
                }

              }

            }
            
          }).error( function(data, status, headers, config) {
            console.log("NOK");
            $scope.apiError = true;
          });
  } 


  
}]);
