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
app.factory('fac_todo', function ($filter) {
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
        },
        get_task_by_id: function(id){
            var user = JSON.parse(window.localStorage.getItem('logonID'))
            var todo = JSON.parse(window.localStorage.getItem('todo'))
            var index = 0
            for(var i in todo){
                if(todo[i].UID == user.ID && todo[i].ID == id){
                    index = i
                }
            }
            return todo[index]
        },
        set_style: function(arr){
            for (var i in arr) {
                arr[i].Color = (arr[i].Status == arrStatus[0]) ? 'bg-success'
                    : (arr[i].Status == arrStatus[1]) ? 'bg-warning'
                        : (arr[i].Status == arrStatus[2]) ? 'bg-danger'
                            : 'bg-secondary'
            }
            return arr
        },
        sort_by_date_add: function(arr){
            arr = $filter('orderBy')(arr, 'DateAdd', true)
            return arr
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
        $rootScope.arr_tasks = fac_todo.set_style($rootScope.arr_tasks)
        $rootScope.arr_tasks = fac_todo.sort_by_date_add($rootScope.arr_tasks)

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
        $rootScope.arr_tasks = fac_todo.set_style($rootScope.arr_tasks)
        $rootScope.arr_tasks = fac_todo.sort_by_date_add($rootScope.arr_tasks)
    }
})



// ctrl todo
app.controller('ctrl_todo', function ($scope, fac_todo, $filter, $rootScope, fac_user) {
    // load todo
    $scope.arr_headers = ["Name", "From", "To", "Status", "Sort"]

    $scope.funcLoadUserTodo = function () {
        fac_todo.load_user_todo()
        $rootScope.arr_tasks = fac_todo.get_tasks()
        $rootScope.arr_tasks = fac_todo.set_style($rootScope.arr_tasks)
        $rootScope.arr_tasks = fac_todo.sort_by_date_add($rootScope.arr_tasks)
    }

    // sort table
    $scope.sortColumn = "Sort";
    $scope.reverseSort = false;
    $scope.sortData = function (columnIndex) {
        // console.log(columnIndex)
        $scope.reverseSort = ($scope.sortColumn == $scope.arr_headers[columnIndex]) ? !$scope.reverseSort : false;
        $scope.sortColumn = $scope.arr_headers[columnIndex];
    }

    // refresh
    $scope.funcRefresh = function () {
        $scope.sortColumn = "Sort";
        $scope.reverseSort = false;
        this.funcLoadUserTodo()

        document.querySelector('#txt_search').value = ''
        document.querySelector('#select_state').selectedIndex = 1;
    }

    // task edit
    $scope.funcTaskDetail = function(id){
        var task = fac_todo.get_task_by_id(id)
        $scope.current_task = task
        $scope.txt_edit_name = task.Name
        $scope.date_edit_start = new Date(task.DateStart)
        $scope.date_edit_end = new Date(task.DeadLine)
        $scope.edit_state = arrStatus
        $scope.select_edit_state = task.Status
        $scope.txt_edit_comment = task.Comment

        if(task.Status == 'Done'){
            $("#txt_edit_name").prop('readonly', true);
            $("#date_edit_start").prop('readonly', true);
            $("#date_edit_end").prop('readonly', true);
            $('#select_edit_state').prop('disabled', 'disabled');
            $('#txt_edit_comment').prop('readonly', true);
            $scope.editable = false;
        }
        else{
            $("#txt_edit_name").prop('readonly', false);
            $("#date_edit_start").prop('readonly', false);
            $("#date_edit_end").prop('readonly', false);
            $('#select_edit_state').prop('disabled', false);
            $('#txt_edit_comment').prop('readonly', false);
            $scope.editable = true;
        }
    }

    // save edit task
    $scope.funcEdit = function(id){
        var uid = (fac_user.get_user()).ID
        fac_todo.load_all_tasks()
        var todo = fac_todo.get_tasks()
        var task = todo[0]
        var index = 0
        for(var i in todo){
            if(todo[i].UID == uid && todo[i].ID == id){
                task = {
                    "UID": parseInt(uid),
                    "ID": id,
                    "Name": $scope.txt_edit_name,
                    "Status": $scope.select_edit_state,
                    "DateStart": $scope.date_edit_start,
                    "DeadLine": $scope.date_edit_end,
                    "DateAdd": todo[i].DateAdd,
                    "Comment": $scope.txt_edit_comment
                }
                index = i
            }
        }
        todo[index] = task
        fac_todo.set_todo(todo)
        this.funcLoadUserTodo()

        document.querySelector('#btn_close_edit').click()
    }
    
    // delete task
    $scope.funcLoadDelete = function(id){
        $scope.current_task = fac_todo.get_task_by_id(id)
    }

    $scope.funcDeleteTask = function(){
        fac_todo.load_all_tasks()
        var todo = fac_todo.get_tasks()
        var index
        for(var i in todo){
            if(todo[i].UID == $scope.current_task.UID 
                && todo[i].ID == $scope.current_task.ID){
                    index = i
                }
        }
        todo.splice(index, 1)

        fac_todo.set_todo(todo)
        $scope.funcLoadUserTodo()

        document.querySelector('#btn_close_delete').click()
    }

    // info task
    $scope.funcShowInfo = function(id){
        $scope.current_task = fac_todo.get_task_by_id(id)
        var tempArr = []
        tempArr.push($scope.current_task)
        fac_todo.set_style(tempArr)
    }


})