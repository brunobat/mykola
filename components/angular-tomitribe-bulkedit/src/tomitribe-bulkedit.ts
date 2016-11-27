module tomitribe_bulkbar {
    require('./tomitribe-bulkedit.sass');

    angular
        .module('tomitribe-bulkedit', [])
        .directive('tribeBulkedit', tribebulkbar);

    function tribebulkbar() {
        return {
            restrict: 'E',
            template: require('./tomitribe-bulkedit.jade'),
            controller: ['$scope', '$document', bulkEditController],
            scope: {
                operatorItems: '=',
                listItems: '=',
                phrase: '@?',
                selectField: '@?'
            },
            link:link
        };
        function link(scope)
        {
            scope.selectState = false;
            scope.showAllChecker = true;
            if(!scope.selectField) scope.selectField = "$$selected";
            if(!scope.phrase) scope.phrase = "shift+click to select, esc to deselect all";
        }

        function bulkEditController($scope, $document) {
            $scope.$watchCollection(
                function(){
                    if(!$scope.listItems) return [];
                    var selectedItems = [];
                    if($scope.listItems.length > 0){
                        angular.forEach($scope.listItems, function(item){
                            if(item[$scope.selectField]) selectedItems.push(item);
                        });
                    }
                    return selectedItems;
                },function(data){
                    $scope.selectedCount = data.length;
                    $scope.selectedItems = data;
                    $scope.allChecked = (data.length === $scope.listItems.length);
            }, true);

            $scope.checkAll = function(state){
                if(typeof state === "boolean"){
                    $scope.selectState = state;
                } else {
                    $scope.selectState = !$scope.selectState;
                }
                angular.forEach($scope.listItems, function(item){
                    item[$scope.selectField] = state;
                });
            };

            $scope.applyBulk = function(operator){
                if(!operator) return;
                var items = $scope.selectedItems,
                    applyAll = operator.applyAll || false;
                if(!!items && items.length > 0) {
                    if(applyAll) {
                        operator.invoke(items);
                    }else{
                        angular.forEach($scope.selectedItems, function(item){
                                operator.invoke(item);
                        });
                    }
                }

            };

            $document.on('keyup', function (e) {
                if (e.keyCode === 27) {
                    $scope.checkAll(false);
                    $scope.$apply();
                }
            });
        }
    }

}