const APPROVE = "APPROVE";
const MANUAL_MERGE_MESSAGE = "merge this manually";
const RENOVATE_BOT = "renovate[bot]";
const RENOVATE_APPROVE_BOT = "renovate-approve[bot]";

function isRenovateApproved(context) {
  return context && context.payload && context.payload.review;
}

module.exports = app => {
  app.log("App is loaded");
  function isRenovate(context) {
    try {
      return context.payload.sender.login === RENOVATE_BOT;
    } catch (err) {
      app.log(err);
      return false;
    }
  }

  function isAutomerging(context) {
    try {
      return !context.payload.body.pull_request.body.includes(
        MANUAL_MERGE_MESSAGE
      );
    } catch (err) {
      app.log(err);
      return false;
    }
  }
  function isRenovateApprover(context) {
    try {
      return context.payload.review.user.login === RENOVATE_APPROVE_BOT;
    } catch (err) {
      app.log(err);
      return false;
    }
  }
  function isRenovateUser(context) {
    try {
      return context.payload.pull_request.user.login === RENOVATE_BOT;
    } catch (err) {
      app.log(err);
      return false;
    }
  }
  function approvePr(context) {
    const params = context.repo();
    params.number = context.payload.number;
    params.event = APPROVE;
    return context.github.pullRequests.createReview(params);
  }
  app.on("pull_request.opened", async context => {
    app.log("Received PR open event");
    if (isRenovate(context) && isAutomerging(context)) {
      app.log("Approving new PR");
      return approvePr(context);
    }
  });
  app.on("pull_request_review.dismissed", async context => {
    app.log("Received PR review dismiss event");
    app.log(context.payload);
    if (
      isRenovate(context) &&
      isAutomerging(context) &&
      isRenovateApprover(context) &&
      isRenovateUser(context)
    ) {
      app.log("Re-approving dismissed approval");
      return approvePr(context);
    }
  });
};
