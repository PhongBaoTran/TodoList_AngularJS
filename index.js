var arr_states = arrStatus
var app = angular.module('app_index', [])

// fac user
app.factory('fac_user', function () {
    return {
        set_user: function (id) {
            window.localStorage.setItem('logonID', JSON.stringify(id))
        },
        get_user: function () {
            var id = JSON.parse(window.localStorage.getItem('logonID'))
            return id
        },
        logout: function () {
            window.localStorage.setItem('logonID', null)
            window.location.href = 'login.html'
        }
    }
})

// fac todo
app.factory('fac_todo', function () {
    var tasks = {}
    return {
        load_user_todo: function () {
            var todo = JSON.parse(window.localStorage.getItem('todo'))
            var user = JSON.parse(window.localStorage.getItem('logonID'))
            var result = new Array()
            for (var i in todo) {
                if (todo[i].UID == user.ID) {
                    result.push(todo[i])
                }
            }
            tasks = result
        },
        load_task_by_status: function (arr, status) {
            var result = new Array()
            for (var i in arr) {
                if (arr[i].Status == status) {
                    result.push(arr[i])
                }
            }
            tasks = result
        },
        get_tasks: function () {
            return tasks
        },
        set_tasks: function (t) {
            tasks = t
        },
        load_task_by_name: function (arr, name) {
            var result = new Array()
            name = name.toLowerCase()
            for (var i in arr) {
                if (arr[i].Name.toLowerCase().indexOf(name) !== -1) {
                    result.push(arr[i])
                }
            }
            tasks = result
        },
        load_all_tasks: function () {
            var todo = JSON.parse(window.localStorage.getItem('todo'))
            tasks = todo
        },
        set_todo: function (arr) {
            window.localStorage.setItem('todo', JSON.stringify(arr))
        }
    }
})

// ctrl user
app.controller('ctrl_user', function ($scope, fac_user) {
    // check login
    $scope.funcCheckLogin = function () {
        if (fac_user.get_user() == null) {
            window.location.href = 'login.html'
        }
        else {
            this.funcLoadUserInfo()
        }
    }

    // load info
    $scope.funcLoadUserInfo = function () {
        var user = (JSON.parse(window.localStorage.getItem('user'))).find(a => a.ID == (fac_user.get_user()).ID)
        $scope.user_avatar = user.Avatar
        $scope.user_name = user.UserName
    }

    // log out
    $scope.funcLogOut = function () {
        fac_user.logout()
    }
})

// ctrl search
app.controller('ctrl_search', function ($scope, fac_todo, $rootScope) {

    $scope.funcSearch = function () {
        // console.log(this.txt_search)
        fac_todo.load_user_todo()
        fac_todo.load_task_by_name(fac_todo.get_tasks(), this.txt_search)
        $rootScope.arr_tasks = fac_todo.get_tasks()
    }
})

// ctrl add
app.controller('ctrl_add', function ($scope, $rootScope, fac_user, fac_todo, $filter) {

    $scope.funcLoadSelect = function () {
        $scope.add_state = arr_states
        this.select_add_state = this.add_state[1]
    }

    // add task
    $scope.funcAddTask = function () {
        if (this.txt_add_name == '' || this.txt_add_name == null) {
            this.txt_add_name = ''
        }
        else {
            fac_todo.load_user_todo()
            var task = {
                "UID": (fac_user.get_user()).ID,
                "ID": (fac_todo.get_tasks()).length,
                "Name": this.txt_add_name,
                "Status": this.select_add_state,
                "DateStart": this.date_start == null ? (new Date(Date.now())) : this.date_start,
                "DeadLine": this.date_end == null ? (new Date(Date.now())) : this.date_end,
                "DateAdd": new Date(Date.now()),
                "Comment": this.txt_add_comment == null ? '' : this.txt_add_comment,
            }
            // console.log(task)

            fac_todo.load_all_tasks()
            var temp = fac_todo.get_tasks()
            temp.push(task)
            fac_todo.set_todo(temp)

            fac_todo.load_user_todo()
            $rootScope.arr_tasks = fac_todo.get_tasks()
            for (var i in $rootScope.arr_tasks) {
                $rootScope.arr_tasks[i].Color = ($rootScope.arr_tasks[i].Status == arrStatus[0]) ? 'bg-success'
                    : ($rootScope.arr_tasks[i].Status == arrStatus[1]) ? 'bg-warning'
                        : ($rootScope.arr_tasks[i].Status == arrStatus[2]) ? 'bg-danger'
                            : 'bg-secondary'
            }

            $rootScope.arr_tasks = $filter('orderBy')($rootScope.arr_tasks, 'DateAdd', true)

            document.querySelector('#btn_close_add').click()
        }
    }

})

// ctrl filter
app.controller('ctrl_filter', function ($scope, fac_todo, $rootScope, $filter) {
    var todo = JSON.parse(window.localStorage.getItem('todo'))

    // set filter
    $rootScope.arr_opt = ["All states"]
    $scope.funcLoadSelect = function () {
        for (var i in arr_states) this.arr_opt.push(arr_states[i])
        $scope.select_state = this.arr_opt[0]
    }

    // filter
    $scope.funcStateFilter = function () {
        if (this.select_state == $rootScope.arr_opt[0]) {
            fac_todo.load_user_todo()
            $rootScope.arr_tasks = fac_todo.get_tasks()
        }
        else {
            fac_todo.load_user_todo()
            fac_todo.load_task_by_status(fac_todo.get_tasks(), this.select_state)
            $rootScope.arr_tasks = fac_todo.get_tasks()
        }
        $rootScope.arr_tasks = $filter('orderBy')(this.arr_tasks, 'DateAdd', true)
    }
})



// ctrl todo
app.controller('ctrl_todo', function ($scope, fac_todo, $filter, $rootScope) {
    // load todo
    $scope.arr_headers = ["Name", "From", "To", "Status", "Sort"]

    $scope.funcLoadUserTodo = function () {
        fac_todo.load_user_todo()
        $rootScope.arr_tasks = fac_todo.get_tasks()
        for (var i in $rootScope.arr_tasks) {
            $rootScope.arr_tasks[i].Color = ($rootScope.arr_tasks[i].Status == arrStatus[0]) ? 'bg-success'
                : ($rootScope.arr_tasks[i].Status == arrStatus[1]) ? 'bg-warning'
                    : ($rootScope.arr_tasks[i].Status == arrStatus[2]) ? 'bg-danger'
                        : 'bg-secondary'
        }

        $rootScope.arr_tasks = $filter('orderBy')($rootScope.arr_tasks, 'DateAdd', true)
    }

    // sort table
    $scope.sortColumn = "Sort";
    $scope.reverseSort = false;
    $scope.sortData = function (columnIndex) {
        console.log(columnIndex)
        $scope.reverseSort = ($scope.sortColumn == $scope.arr_headers[columnIndex]) ? !$scope.reverseSort : false;
        $scope.sortColumn = $scope.arr_headers[columnIndex];
    }

    // refresh
    $scope.funcRefresh = function () {
        $scope.sortColumn = "Sort";
        $scope.reverseSort = false;
        this.funcLoadUserTodo()
    }

    // task edit
    $scope.funcTaskDetail = function(task){
        console.log(task)
    }
    $scope.funcCheckEdit() = function(){
        
    }
})