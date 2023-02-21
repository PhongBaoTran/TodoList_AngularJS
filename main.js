// init data
userList = new Array();
todoList = new Array();
var arrStatus = ["Done", "In process", "Paused", "Preparing"]
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function initData() {
    if (window.localStorage.getItem("user") == null) {
        for (i = 0; i < 3; i++) {
            var user = {
                "ID": i,
                "UserName": "user" + i,
                "Password": "pass" + i,
                "Avatar": 'assets/img/avatars/' + (Math.floor(Math.random() * 4) + 1) +'.png'
            }
            userList[i] = user;
        }
        window.localStorage.setItem('user', JSON.stringify(userList))
    }

    if (window.localStorage.getItem("todo") == null) {
        for (i = 0; i < 3; i++) {
            for (z = 0; z < (Math.floor(Math.random() * 10) + 1); z++) {
                var todo = {
                    "UID": i,
                    "ID": z,
                    "Name": 'Task ' + z,
                    "Status": arrStatus[Math.floor(Math.random() * arrStatus.length)],
                    "DateStart": new Date(randomDate(new Date(2010, 0, 1), new Date())),
                    "DeadLine": new Date(randomDate(new Date(2010, 0, 1), new Date())),
                    "DateAdd": new Date(randomDate(new Date(2010, 0, 1), new Date())),
                    "Comment": 'Comment ' + z
                }
                todoList.push(todo);
            }
        }
        window.localStorage.setItem('todo', JSON.stringify(todoList))
    }

    if (window.localStorage.getItem('logonID') == null) {
        window.localStorage.setItem('logonID', null)
    }
}
initData();