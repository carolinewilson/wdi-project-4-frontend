"use strict";function Auth(e,t){e.loginUrl=t+"/login",e.signupUrl=t+"/register",e.tokenPrefix="",e.oauth2({name:"strava",url:t+"/oauth/strava",clientId:"15120",redirectUri:window.location.origin,authorizationEndpoint:"https://www.strava.com/oauth/authorize"})}function RegisterController(e,t,a){function o(){e.signup(r.user).then(function(e){a.localStorage.setItem("token",e.data.token),t.go("setup")})}var r=this;r.user={},r.submit=o}function LoginController(e,t){function a(){e.login(o.credentials).then(function(e){e.data.user.user_plans.forEach(function(e){e.active&&(o.activePlans=!0)}),o.activePlans?t.go("plansIndex"):t.go("setup")})}var o=this;o.credentials={},o.activePlans=!1,o.submit=a}function DaysIndexController(e,t){var a=this;a.plan=e.get(t.params)}function DaysShowController(e,t,a,o){function r(){l.day.completed=!0,e.update(l.dayId,l.day)}var l=this;if(l.planId=t.params.planId,l.dayId=t.params.dayId,l.day=e.get({id:l.dayId}),t.params.stravaId){var n=a.localStorage.getItem("strava_token"),s=t.params.stravaId;o.activityShow(n,s).then(function(e){l.stravaData=e},function(e){console.log(e)})}l.markDone=r}function Day(e,t){return new e(t+"/user_days/:id",{id:"@id"},{update:{method:"PUT"}})}function daysList(){return{restrict:"E",replace:!0,templateUrl:"templates/daysList.html",scope:{days:"=",plan:"="}}}function googleMap(e){return{restrict:"E",replace:!0,template:'<div class="google-map"></div>',scope:{data:"="},link:function(t,a){t.$watch("data",function(){var o=new e.google.maps.Map(a[0],{center:{lat:t.data[0].lat,lng:t.data[0].lng},zoom:14,disableDefaultUI:!0,zoomControl:!0,scaleControl:!0,scrollwheel:!1}),r=new e.google.maps.Polyline({path:t.data,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:2});r.setMap(o)})}}}function MainController(e,t,a,o,r,l,n,s){function i(){var a=e.getPayload().id;t.go("usersShow",{id:a})}function c(){e.logout().then(function(){t.go("homepage")})}var d=this,u=r.moment;n.hash("top"),s(),d.isLoggedIn=e.isAuthenticated,d.hasActivePlan=!1,l.uiRouterState=t,d.hasStrava=r.localStorage.getItem("strava_token"),d.isLoggedIn()&&(d.currentUser=e.getPayload().id,d.all=a.get({id:d.currentUser},function(e){e.user_plans.forEach(function(e){e.active&&(d.activePlan=e.id,o.get({id:e.id},function(t){var a=u().format("YYYY-MM-DD"),o=u(e.start_date).format("YYYY-MM-DD");o<=a?d.planStarted=!1:d.planStarted=!0,t.user_days.forEach(function(e){var t=u(e.date).format("YYYY-MM-DD");t===a&&(d.hasActivePlan=!0,d.dayId=e.id)})}))})})),d.logout=c,d.getUserId=i}function PlansIndexController(e,t){var a=this;a.currentUser=t.getPayload().id,a.all=e.get({id:a.currentUser},function(){a.all.user_plans.forEach(function(e){e.active&&(a.hasActivePlan=!0)})})}function PlansShowController(e,t,a){var o=this,r=a.moment;o.plan=e.get(t.params,function(){if(o.totalWorkouts=0,o.totalMiles=0,o.completedWorkouts=0,o.completedMiles=0,o.labels=[],o.series=["Target","Actual"],o.targetData=[],o.actualData=[],o.colors=["#45b7cd","#ff6384"],o.plan.active){var e=r(o.plan.start_date).format("YYYY-MM-DD"),t=r().format("YYYY-MM-DD");e>t?o.plan.future=!0:o.plan.future=!1,console.log(o.plan.future)}o.hasStrava=a.localStorage.getItem("strava_token");for(var l=o.plan.user_days.length/7,n=0;n<l;n++)o.labels.push("Week "+(n+1)),o.targetMiles=0,o.actualMiles=0,o.plan.user_days.forEach(function(e){e.week===n+1&&(e.exercise&&(o.targetMiles+=e.exercise.miles),e.completed&&(o.actualMiles+=e.exercise.miles))}),o.targetData.push(o.targetMiles),o.actualData.push(o.actualMiles);o.data=[o.targetData,o.actualData],o.plan.user_days.forEach(function(e){var t=r(e.date).format("YYYY-MM-DD"),a=r().format("YYYY-MM-DD");t===a&&(o.currentWeek=e.week),e.exercise&&(o.totalWorkouts+=1,o.totalMiles+=e.exercise.miles,e.completed&&(o.completedWorkouts+=1,o.completedMiles+=e.exercise.miles))}),o.totalMiles=Math.floor(o.totalMiles),o.completedMiles=Math.floor(o.completedMiles)})}function PlansEditController(e,t){function a(){r.plan.active=!1,t.update(e.params,r.plan,function(){e.go("plansIndex")})}function o(){t.remove(e.params,function(){e.go("plansIndex")})}var r=this;r.plan=t.get(e.params),r.endPlan=a,r.deletePlan=o}function PlansNewController(e,t,a){function o(e){r.activePlan.active=!1,t.update(e,r.activePlan,function(){a.go("setup")})}var r=this;e.get(a.params,function(e){r.userPlans=e.user_plans,r.hasActivePlan=!1,r.userPlans.forEach(function(e){e.active===!0&&(r.hasActivePlan=!0,r.activePlan=e)}),r.hasActivePlan||a.go("setup")}),r.endPlan=o}function Router(e,t){e.state("homepage",{url:"/",templateUrl:"/templates/homepage.html",controller:"MainController as main"}).state("setup",{url:"/setup",templateUrl:"/templates/setup.html",controller:"SetupController as setupPlan"}).state("plansIndex",{url:"/plans",templateUrl:"/templates/plansIndex.html",controller:"PlansIndexController as plansIndex"}).state("plansShow",{url:"/plans/:id",templateUrl:"/templates/plansShow.html",controller:"PlansShowController as plansShow"}).state("plansEdit",{url:"/plans/:id/end",templateUrl:"/templates/plansEdit.html",controller:"PlansEditController as plansEdit"}).state("plansNew",{url:"/:id/new",templateUrl:"/templates/plansNew.html",controller:"PlansNewController as plansNew"}).state("weeksShow",{url:"/plans/:planId/weeks/:weekId",templateUrl:"/templates/weeksShow.html",controller:"WeeksShowController as weeksShow"}).state("weeksEdit",{url:"/plans/:planId/weeks/:weekId/edit",templateUrl:"/templates/weeksEdit.html",controller:"WeeksEditController as weeksEdit"}).state("daysIndex",{url:"/plans/:id/days",templateUrl:"/templates/daysIndex.html",controller:"DaysIndexController as daysIndex"}).state("daysShow",{url:"/plans/:planId/days/:dayId?stravaId",templateUrl:"/templates/daysShow.html",controller:"DaysShowController as daysShow"}).state("stravaIndex",{url:"/strava",templateUrl:"/templates/stravaIndex.html",controller:"StravaIndexController as stravaIndex"}).state("usersIndex",{url:"/users",templateUrl:"/templates/usersIndex.html",controller:"UsersIndexController as usersIndex"}).state("usersShow",{url:"/users/:id",templateUrl:"/templates/usersShow.html",controller:"UsersShowController as usersShow"}).state("usersEdit",{url:"/users/:id/edit",templateUrl:"/templates/usersEdit.html",controller:"UsersEditController as usersEdit"}).state("register",{url:"/register",templateUrl:"/templates/register.html",controller:"RegisterController as register"}).state("login",{url:"/login",templateUrl:"/templates/login.html",controller:"LoginController as login"}),t.otherwise("/")}function SetupController(e,t,a){function o(){e.save(r,function(){t.go("plansIndex")})}var r=this,l=a.moment;r.end_date=new Date(l().add(6,"weeks").format("YYYY-MM-DD")),r.create=o}function StravaIndexController(e,t,a,o,r,l,n,s){function i(){return!!n.localStorage.getItem("strava_token")}function c(){return n.localStorage.getItem("strava_token")}function d(e){for(var t=function(t){var a=h.userDays.findIndex(function(a){return f(a.date).format("YYYY-MM-DD")===e[t].start_date});a>0&&(e[t].userDay=h.userDays.splice(a,1)[0])},a=0;a<e.length;a++)t(a);return e}function u(){r.query({user_id:g,active:!0}).$promise.then(function(e){if(h.planId=e[0].id,h.userDays=e[0].user_days,i())return t.activityIndex(c())}).then(function(e){h.allActivities=d(e||[]);var t=h.userDays.filter(function(e){return e.completed});h.allActivities.concat(t)}).catch(function(e){console.log(e)})}function p(e,t,a){console.log(e,t,a),l.get({id:t},function(e){console.log(e),e.completed=!0,e.strava_id=a,console.log(e)})}function m(){i()?u():a.authenticate("strava").then(function(e){n.localStorage.setItem("strava_token",e.data.access_token);var t=e.data.athlete.id;o.update({id:g},{strava_id:t},function(){u()})})}var h=this,f=n.moment,g=a.getPayload().id;h.allActivities=[],h.userDays=[],u(),h.markComplete=p,h.sync=m}function StravaService(e,t){function a(t){return e({method:"GET",url:"http://localhost:3000/api/strava",params:{accessToken:t}}).then(function(e){return e.data.forEach(function(e){e.start_date=r(e.start_date).format("YYYY-MM-DD"),e.distance=(e.distance/1e3*.621371).toFixed(1),e.elapsed_hours=Math.floor(e.elapsed_time/60/60),e.elapsed_minutes=Math.floor(e.elapsed_time/60%60),e.elapsed_seconds=(e.elapsed_time%60*60).toString().slice(0,2)%60}),e.data},function(e){console.log(e)})}function o(t,a){return e({method:"GET",url:"http://localhost:3000/api/strava/activity",params:{activityId:a,accessToken:t}}).then(function(e){return e.data.distance=(e.data.distance/1e3*.621371).toFixed(1),e.data.elapsed_minutes=Math.floor(e.data.elapsed_time/60),e.data.elapsed_seconds=e.data.elapsed_time%60*60,e.data},function(e){console.log(e)})}var r=t.moment;this.activityIndex=a,this.activityShow=o}function User(e,t){return new e(t+"/users/:id",{id:"@id"},{update:{method:"PUT"}})}function UserPlan(e,t){return new e(t+"/user_plans/:id",{id:"@id"},{update:{method:"PUT"}})}function UsersIndexController(e){var t=this;t.all=e.query()}function UsersShowController(e,t,a,o){function r(){s.user.$remove(function(){t.go("usersIndex")})}function l(){a.logout().then(function(){o.localStorage.removeItem("strava_token"),t.go("homepage")})}function n(){a.authenticate("strava").then(function(a){o.localStorage.setItem("strava_token",a.data.access_token),s.user.strava_id=a.data.athlete.id,e.update(s.user.id,s.user,function(){t.go("stravaIndex")})})}var s=this;s.user=e.get(t.params),s.logout=l,s.delete=r,s.authenticateStrava=n}function UsersEditController(e,t){function a(){e.update(o.user.id,o.user,function(){t.go("usersShow",t.params)})}var o=this;o.user=e.get(t.params),o.update=a}function WeeksShowController(e,t){var a=this;a.planId=t.params.planId,a.weekId=t.params.weekId,a.totalWorkouts=0,a.completedWorkouts=0,a.totalMiles=0,a.completedMiles=0,e.get({id:a.planId,week:a.weekId},function(e){a.thisWeek=e.user_days,a.thisWeek.forEach(function(e){e.exercise&&(a.totalWorkouts+=1,a.totalMiles+=e.exercise.miles,e.completed&&(a.completedWorkouts+=1,a.completedMiles+=e.exercise.miles))}),console.log(a.thisWeek),a.totalMiles=Math.floor(a.totalMiles),a.completedMiles=Math.floor(a.completedMiles)})}function WeeksEditController(e,t){function a(e){var t=r.startingDay.position;r.thisWeek.splice(e,1),r.thisWeek.forEach(function(e){e.position=t,t++})}function o(){e.update(r.planId,r.plan)}var r=this;r.planId=t.params.planId,r.weekId=t.params.weekId,e.get({id:r.planId,week:r.weekId},function(e){r.plan=e,r.thisWeek=e.user_days.sort(function(e,t){return e.position-t.position}),r.startingDay=e.user_days[0]}),r.updatePosition=a,r.savePlan=o}angular.module("finalProject",["ngResource","ui.router","satellizer","chart.js","dndLists","ngMessages","ngMaterial"]).constant("API_URL","http://localhost:3000/api").config(Auth),Auth.$inject=["$authProvider","API_URL"],angular.module("finalProject").controller("RegisterController",RegisterController).controller("LoginController",LoginController),RegisterController.$inject=["$auth","$state","$window"],LoginController.$inject=["$auth","$state"],angular.module("finalProject").controller("DaysIndexController",DaysIndexController).controller("DaysShowController",DaysShowController),DaysIndexController.$inject=["UserPlan","$state"],DaysShowController.$inject=["Day","$state","$window","StravaService"],angular.module("finalProject").factory("Day",Day),Day.$inject=["$resource","API_URL"],angular.module("finalProject").directive("daysList",daysList),angular.module("finalProject").directive("googleMap",googleMap),googleMap.$inject=["$window"],angular.module("finalProject").controller("MainController",MainController),MainController.$inject=["$auth","$state","User","UserPlan","$window","$scope","$location","$anchorScroll"],angular.module("finalProject").controller("PlansIndexController",PlansIndexController).controller("PlansShowController",PlansShowController).controller("PlansEditController",PlansEditController).controller("PlansNewController",PlansNewController),PlansIndexController.$inject=["User","$auth"],PlansShowController.$inject=["UserPlan","$state","$window"],PlansEditController.$inject=["$state","UserPlan"],PlansNewController.$inject=["User","UserPlan","$state"],angular.module("finalProject").config(Router),Router.$inject=["$stateProvider","$urlRouterProvider"],angular.module("finalProject").controller("SetupController",SetupController),SetupController.$inject=["UserPlan","$state","$window"],angular.module("finalProject").controller("StravaIndexController",StravaIndexController),StravaIndexController.$inject=["$http","StravaService","$auth","User","UserPlan","Day","$window","$state"],angular.module("finalProject").service("StravaService",StravaService),StravaService.$inject=["$http","$window"],angular.module("finalProject").factory("User",User),User.$inject=["$resource","API_URL"],angular.module("finalProject").factory("UserPlan",UserPlan),UserPlan.$inject=["$resource","API_URL"],angular.module("finalProject").controller("UsersIndexController",UsersIndexController).controller("UsersShowController",UsersShowController).controller("UsersEditController",UsersEditController),UsersIndexController.$inject=["User"],UsersShowController.$inject=["User","$state","$auth","$window"],UsersEditController.$inject=["User","$state"],angular.module("finalProject").controller("WeeksShowController",WeeksShowController).controller("WeeksEditController",WeeksEditController),WeeksShowController.$inject=["UserPlan","$state"],WeeksEditController.$inject=["UserPlan","$state"];
//# sourceMappingURL=app.js.map
