
// login ctrl
angular.module('app_login', ['ngStorage', 'ui.bootstrap'])
    .controller('ctrl_login', ['$scope', '$localStorage', '$rootScope', function ($scope, $localStorage, $rootScope) {
        $scope.funcLogin = function () {
            userList = JSON.parse(localStorage.getItem('user'))
            var exists = false;
            for (var i in userList) {
                if (userList[i].UserName == this.login_username) {
                    if (userList[i].Password == this.login_pass) {
                        exists = true
                        logonID = { "ID": i }
                    }
                }
            }
            if (exists == false) {
                window.alert("Wrong user name or password!")
            }
            else {
                window.localStorage.setItem('logonID', JSON.stringify(logonID))
                window.location.href = "Index.html"
            }
        }

        $scope.funcCheckLogin = function(){
            if(window.localStorage.getItem('logonID').ID != null){
                window.location.href = 'index.html'
            }
        }
    }]);