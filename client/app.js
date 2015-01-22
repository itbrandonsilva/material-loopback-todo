"use strict";

angular.module("app", ["ngMaterial"])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('main')
            .primaryColor('blue')
            .accentColor('grey')
            .warnColor('red');
        $mdThemingProvider.setDefaultTheme('main');
    })
    .controller("TodoController", ["$scope", "APIService", "$mdDialog", function ($scope, api, $mdDialog) {
        $scope.removing = false;

        $scope.logout = function () {
            $scope.accessToken = null;
            $scope.tasks = [];
            $scope.username = null;
            $scope.userId = null;
        };

        $scope.updateTask = function ($event, taskId, updated) {
            api.updateTask(taskId, updated, function () {
                $scope.getTasks();
            });
        };

        $scope.removeTask = function ($event, taskId) {
            $scope.removing = false;
            api.deleteTask(taskId, function () {
                $scope.getTasks();
            });
        };

        $scope.registerDialog = function ($event) {
            $mdDialog.show({
                controller: RegisterDialogController,
                templateUrl: "/views/registerDialog.html",
                targetEvent: $event
            })
            .then(function() {
                $scope.getTasks();
            });
        };

        $scope.loginDialog = function ($event) {
            $mdDialog.show({
                controller: LoginDialogController,
                templateUrl: "/views/loginDialog.html",
                targetEvent: $event
            })
            .then(function (res) {
                console.log(res);
                $scope.accessToken = res.id;
                $scope.username = res.username;
                $scope.userId = res.userId;
                $scope.getTasks();
            });
        };

        $scope.taskDialog = function ($event) {
            $mdDialog.show({
                controller: TaskDialogController,
                templateUrl: "/views/taskDialog.html",
                targetEvent: $event
            })
            .then(function(answer) {
                $scope.getTasks();
            });
        };

        $scope.getTasks = function () {
            api.getTasks(function (err, res) {
                if (err) throw err;
                $scope.tasks = res;
                console.log(JSON.stringify($scope.tasks));
            });
        };

        $scope.logout();
    }])
    .service("APIService", function ($http) {

        var userId;
        var token;

        this.register = function (fields, cb) {
            $http.post("/api/users", fields)
                .success(function (res) {
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

        this.login = function (fields, cb) {
            $http.post("/api/users/login", fields)
                .success(function (res) {
                    userId = res.userId;
                    token = res.id;
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

        this.getTasks = function (cb) {
            $http.get("/api/users/" + userId + "/tasks?access_token=" + token)
                .success(function (res) {
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

        this.newTask = function (fields, cb) {
            $http.post("/api/users/" + userId + "/tasks?access_token=" + token, fields)
                .success(function (res) {
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

        this.updateTask = function (taskId, updated, cb) {
            $http.put("/api/users/" + userId + "/tasks/" + taskId + "?access_token=" + token, updated)
                .success(function (res) {
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

        this.deleteTask = function (taskId, cb) {
            $http.delete("/api/users/" + userId + "/tasks/" + taskId + "?access_token=" + token)
                .success(function (res) {
                    return cb(null, res);
                })
                .error(function (err) {
                    return cb(err);
                });
        }

    });
;

function RegisterDialogController($scope, $mdDialog, APIService) {
    var api = APIService;

    $scope.form = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.register = function () {
        api.register($scope.form, function (err) {
            if (err) throw err;
            $mdDialog.hide();
        });
    };
}


function LoginDialogController($scope, $mdDialog, APIService) {
    var api = APIService;

    $scope.form = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.login = function () {
        api.login($scope.form, function (err, res) {
            if (err) throw err;
            res.username = $scope.form.username;
            $mdDialog.hide(res);
        });
    };
}

function TaskDialogController($scope, $mdDialog, APIService) {
    var api = APIService;

    $scope.form = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.addTask = function ($event) {
        api.newTask({description: $scope.form.description}, function (err, res) {
            if (err) throw err;
        });
        $mdDialog.hide();
    };
}
