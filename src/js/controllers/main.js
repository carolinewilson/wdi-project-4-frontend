angular.module('finalProject')
  .controller('MainController', MainController);

MainController.$inject = ['$auth','$state','User','UserPlan', '$window'];
function MainController($auth, $state, User, UserPlan, $window){
  const main = this;
  const moment = $window.moment;

  main.isLoggedIn = $auth.isAuthenticated;
  main.hasActivePlan = false;
  main.currentUser = $auth.getPayload().id;

  if (main.isLoggedIn()) {
    main.currentUser = $auth.getPayload().id;
  }

  main.all = User.get({id: main.currentUser}, (res) => {
    res.user_plans.forEach((plan) => {
      if (plan.active) {
        main.activePlan = plan.id;
        
        UserPlan.get({id: plan.id}, (data) => {
          data.user_days.forEach((day) => {
            const date = moment(day.date).format('YYYY-MM-DD');
            const today = moment().format('YYYY-MM-DD');
            if (date === today) {
              main.hasActivePlan = true;
              main.dayId = day.id;
            }
          });
        });
      }
    });
  });


  function logout() {
    $auth.logout()
      .then(() => {
        $state.go('homepage');
      });
  }
  main.logout = logout;
}
