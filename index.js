const APPROVE = "APPROVE";
const AUTOMERGE_MESSAGE = "Automerge: enabled";
const RENOVATE_BOT = process.env.RENOVATE_BOT_USER || "renovate[bot]";
const RENOVATE_APPROVE_BOT = process.env.RENOVATE_APPROVE_BOT_USER || "renovate-approve[bot]";

module.exports = app => {
  app.log("App is loaded");
  function isRenovate(context) {
    try {
      return context.payload.sender.login === RENOVATE_BOT;
    } catch (err) {
      context.log(context.payload);
      context.log(err);
      return false;
    }
  }

  function isAutomerging(context) {
    try {
      return context.payload.pull_request.body.includes(AUTOMERGE_MESSAGE);
    } catch (err) {
      context.log(context.payload);
      context.log(err);
      return false;
    }
  }
  function isRenovateApprover(context) {
    try {
      return context.payload.review.user.login === RENOVATE_APPROVE_BOT;
    } catch (err) {
      context.log(err);
      return false;
    }
  }
  function isRenovateUser(context) {
    try {
      return context.payload.pull_request.user.login === RENOVATE_BOT;
    } catch (err) {
      context.log(context.payload);
      context.log(err);
      return false;
    }
  }
  function approvePr(context) {
    try {
      const params = context.issue({ event: APPROVE });
      return context.github.pulls.createReview(params);
    } catch (err) {
      context.log(err);
      context.log(context.payload);
    }
  }
  app.on("pull_request.opened", async context => {
    context.log("Received PR open event");
    if (isRenovate(context) && isAutomerging(context)) {
      context.log("Approving new PR");
      return approvePr(context);
    }
  });
  app.on("pull_request_review.dismissed", async context => {
    context.log("Received PR review dismiss event");
    context.log(context.payload);
    if (
      isRenovate(context) &&
      isAutomerging(context) &&
      isRenovateApprover(context) &&
      isRenovateUser(context)
    ) {
      context.log("Re-approving dismissed approval");
      return approvePr(context);
    }
  });
};
