
// MainCtrl SignUp
angular.module('app_signup', ['ngStorage', 'ui.bootstrap'])
    .controller('ctrl_signup', ['$scope', '$localStorage', '$rootScope', function ($scope, $localStorage, $rootScope) {

        // btn SignUp on click
        $scope.funcSignUp = function () {
            // console.log(this.userName == null)
            if (this.signup_username == null || this.signup_username == "") {
                // window.alert("You didn't enter user name!")
                $scope.error_name = "You didn't enter user name!"
                document.querySelector('#btn_modal_signup').click()
            }
            else if (this.signup_pass == null || this.signup_pass == "") {
                $scope.error_name = "You didn't enter your password!"
                document.querySelector('#btn_modal_signup').click()
            }
            else if (this.signup_pass != this.signup_confirm) {
                $scope.error_name = "Passwords do not match!"
                document.querySelector('#btn_modal_signup').click()
            }
            else {
                var exists = false;
                userList = JSON.parse(window.localStorage.getItem('user'))
                for (var i in userList) {
                    if (userList[i].UserName == this.signup_username) {
                        exists = true;
                    }
                }
                if (exists == true) {
                    window.alert("User name already existed!")
                }
                else {
                    var user = {
                        "ID": userList.length,
                        "UserName": this.signup_username,
                        "Password": this.signup_pass,
                    }
                    userList.push(user)
                    window.localStorage.setItem('user', JSON.stringify(userList))
                    window.location.href = 'Index.html'
                }
            }
        }
    }]);