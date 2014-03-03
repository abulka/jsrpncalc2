function AndyController($scope) {
    $scope.contacts = ["hi@email.com", "hello@email.com"];
    $scope.newcontact = "";

    $scope.add = function () {
        $scope.contacts.push($scope.newcontact);
        $scope.newcontact = "";
        console.log($scope.contacts);
    }

    $scope.zap = function () {
        $scope.contacts = [];
        $scope.newcontact = "";
    }

    $scope.click1 = function (key) {
        $scope.newcontact += key;
    }
}
