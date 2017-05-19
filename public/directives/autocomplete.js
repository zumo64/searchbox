// Not in use anymore
import autocomp from '../templates/autocomplete.html';

var app = require('ui/modules').get('app/searchbox', []);
app.directive('autocomplete', function($compile,$http) {
  return {
    restrict: 'E',
    //replace: true,
    // scope: {
    //   type: '='
    // }, 
    scope: false,
    template: autocomp,
    link:  function ($scope, $elem ) {
        

        var isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength;
        }


       
        $scope.searchStr = null;
        $scope.showDropdown = false;

        
         $scope.doSearch = function($event) {
            console.log("typeName" + $scope.type);
         }


        $scope.keyPressed = function(event) {
          
          

          if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
              if (!$scope.searchStr || $scope.searchStr == "") {
                  $scope.showDropdown = false;
                 
              } 
              else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                  $scope.lastSearchTerm = $scope.searchStr
                  $scope.results = [];

                  $http.get("../searchbox/suggest/"+
                    $scope.indexName+"/"+
                     $scope.typeName+"/"+
                     $scope.fuzziness+"/"+
                     $scope.suggestField+"/"+
                     $scope.searchStr).then (function (response) {
                        if (response.data.suggest && response.data.suggest.generated_phrase_suggestion && response.data.suggest.generated_phrase_suggestion[0].options.length > 0) {
                          $scope.showDropdown = true;
                          $scope.results = response.data.suggest.generated_phrase_suggestion[0].options;
                        }
                        else {
                          $scope.showDropdown = false;
                        }

                  });

              }
              else {
                 $scope.showDropdown = false;
              }

          } else {
              event.preventDefault();
          }
        }

        var inputField = $elem.find('input');
        inputField.on('keyup', $scope.keyPressed);




        return;
    }
  }
})




  