module.exports = robot => {
  robot.on("pull_request.opened", async context => {
    const params = context.repo();
    params.number = context.payload.number;
    params.event = "APPROVE";
    return context.github.pullRequests.createReview(params);
  });
};
