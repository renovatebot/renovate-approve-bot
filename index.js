const APPROVE = "APPROVE";
const MANUAL_MERGE_MESSAGE = "merge this manually";
const RENOVATE_BOT = "renovate[bot]";
const RENOVATE_APPROVE_BOT = "renovate-approve[bot]";

module.exports = app => {
  app.log("App is loaded");
  app.on("pull_request.opened", async context => {
    app.log("Received PR open event");
    if (
      context.payload.sender.login === RENOVATE_BOT &&
      !context.payload.body.pull_request.body.includes(MANUAL_MERGE_MESSAGE)
    ) {
      app.log("Approving new PR");
      const params = context.repo();
      params.number = context.payload.number;
      params.event = APPROVE;
      return context.github.pullRequests.createReview(params);
    }
  });
  app.on("pull_request_review.dismissed", async context => {
    app.log("Received PR review dismiss event");
    app.log(context.payload);
    if (
      context.payload.sender.login === RENOVATE_BOT &&
      !context.payload.body.pull_request.body.includes(MANUAL_MERGE_MESSAGE) &&
      context.payload.review.user.login === RENOVATE_APPROVE_BOT &&
      context.payload.pull_request.user.login === RENOVATE_BOT
    ) {
      app.log("Re-approving dismissed approval");
      const params = context.repo();
      params.number = context.payload.number;
      params.event = APPROVE;
      return context.github.pullRequests.createReview(params);
    }
  });
};
