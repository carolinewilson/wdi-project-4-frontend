angular.module('finalProject')
  .controller('WeeksShowController', WeeksShowController);

WeeksShowController.$inject = ['UserPlan', '$state'];
function WeeksShowController(UserPlan, $state) {
  const weeksShow = this;

  weeksShow.planId = $state.params.planId;
  weeksShow.weekId = $state.params.weekId;

  weeksShow.plan = UserPlan.get({ id: weeksShow.planId }, () => {
    weeksShow.thisWeek = [];

    weeksShow.plan.user_days.forEach((day) => {
      if (day.week == weeksShow.weekId) {
        weeksShow.thisWeek.push(day);
      }
    });
  });
}