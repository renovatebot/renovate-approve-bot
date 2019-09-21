const APPROVE = 'APPROVE';
const MANUAL_MERGE_MESSAGE = 'merge this manually';
const RENOVATE_BOT = 'renovate[bot]';
const RENOVATE_APPROVE_BOT = 'renovate-approve[bot]';

module.exports = robot => {
  robot.log('App is loaded');
  robot.on('pull_request.opened', async context => {
    if (
      context.payload.sender.login === RENOVATE_BOT &&
      !context.payload.body.pull_request.body.includes(MANUAL_MERGE_MESSAGE)
    ) {
      const params = context.repo();
      params.number = context.payload.number;
      params.event = APPROVE;
      return context.github.pullRequests.createReview(params);
    }
  });
  app.on('pull_request_review.dismissed', async context => {
    if (
        context.payload.sender.login === RENOVATE_BOT &&
        !context.payload.body.pull_request.body.includes(MANUAL_MERGE_MESSAGE) &&
        context.payload.review.user.login === RENOVATE_APPROVE_BOT &&
        context.payload.pull_request.user.login === RENOVATE_BOT
      ) {
        const params = context.repo();
        params.number = context.payload.number;
        params.event = APPROVE;
        return context.github.pullRequests.createReview(params);
      }
  });
};
