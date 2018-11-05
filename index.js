module.exports = robot => {
  robot.on('pull_request.opened', async context => {
    if (
      context.payload.sender.login === 'renovate[bot]' &&
      !context.payload.body.pull_request.body.includes('merge this manually')
    ) {
      const params = context.repo();
      params.number = context.payload.number;
      params.event = 'APPROVE';
      return context.github.pullRequests.createReview(params);
    }
  });
};
