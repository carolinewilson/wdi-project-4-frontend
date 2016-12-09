"use strict";function Auth(e,r){e.loginUrl=r+"/login",e.signupUrl=r+"/register",e.tokenPrefix=""}function RegisterController(e,r){function t(){e.signup(l.user).then(function(){r.go("planSetup")})}var l=this;l.user={},l.submit=t}function LoginController(e,r){function t(){e.login(l.credentials).then(function(){r.go("planSetup")})}var l=this;l.credentials={},l.submit=t}function MainController(e,r){function t(){e.logout().then(function(){r.go("login")})}var l=this;l.isLoggedIn=e.isAuthenticated,l.logout=t}function PlanSetupController(){}function Router(e,r){e.state("homepage",{url:"/",templateUrl:"/templates/homepage.html",controller:"MainController as main"}).state("planSetup",{url:"/plan",templateUrl:"/templates/planSetup.html",controller:"PlanSetupController as planSetup"}).state("usersIndex",{url:"/users",templateUrl:"/templates/usersIndex.html",controller:"UsersIndexController as usersIndex"}).state("usersShow",{url:"/users/:id",templateUrl:"/templates/usersShow.html",controller:"UsersShowController as usersShow"}).state("usersEdit",{url:"/users/:id/edit",templateUrl:"/templates/usersEdit.html",controller:"UsersEditController as usersEdit"}).state("register",{url:"/register",templateUrl:"/templates/register.html",controller:"RegisterController as register"}).state("login",{url:"/login",templateUrl:"/templates/login.html",controller:"LoginController as login"}),r.otherwise("/users")}function User(e,r){return new e(r+"/users/:id",{id:"@id"},{update:{method:"PUT"}})}function UsersIndexController(e){var r=this;r.all=e.query()}function UsersShowController(e,r){function t(){l.user.$remove(function(){r.go("usersIndex")})}var l=this;l.user=e.get(r.params),l.delete=t}function UsersEditController(e,r){function t(){e.update(l.user.id,l.user,function(){r.go("usersShow",r.params)})}var l=this;l.user=e.get(r.params),l.update=t}angular.module("finalProject",["ngResource","ui.router","satellizer"]).constant("API_URL","http://localhost:3000/api").config(Auth),Auth.$inject=["$authProvider","API_URL"],angular.module("finalProject").controller("RegisterController",RegisterController).controller("LoginController",LoginController),RegisterController.$inject=["$auth","$state"],LoginController.$inject=["$auth","$state"],angular.module("finalProject").controller("MainController",MainController),MainController.$inject=["$auth","$state"],angular.module("finalProject").controller("PlanSetupController",PlanSetupController),angular.module("finalProject").config(Router),Router.$inject=["$stateProvider","$urlRouterProvider"],angular.module("finalProject").factory("User",User),User.$inject=["$resource","API_URL"],angular.module("finalProject").controller("UsersIndexController",UsersIndexController).controller("UsersShowController",UsersShowController).controller("UsersEditController",UsersEditController),UsersIndexController.$inject=["User"],UsersShowController.$inject=["User","$state"],UsersEditController.$inject=["User","$state"];
//# sourceMappingURL=app.js.map
