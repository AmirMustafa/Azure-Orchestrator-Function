import * as df from "durable-functions";
import moment from "moment";

const orchestrator = df.orchestrator(function* (context) {
  const timeoutInMilliseconds: number = 3000;
  const deadline = moment
    .utc(context.df.currentUtcDateTime)
    .add(timeoutInMilliseconds, "ms");

  const timeoutTask = context.df.createTimer(deadline.toDate());
  const repositoryDetailsTask = context.df.callActivity(
    "GetRepositoryDetailsByName",
    context.bindingData.input
  );

  // Race between Activity Trigger 1 and timeout
  const winner = yield context.df.Task.any([
    repositoryDetailsTask,
    timeoutTask,
  ]);

  if (winner === repositoryDetailsTask) {
    context.log("Repository information fetched before timeout");

    timeoutTask.cancel();

    const userId = repositoryDetailsTask.result;
    context.bindingData.input.userId = userId;
  } else {
    context.log("Repository information call timed out !!");
    throw new Error("Repository information fetched before timeout !!");
  }

  // Activity Trigger 2
  const userInfo = yield context.df.callActivity(
    "GetUserDetailsById",
    context.bindingData.input
  );

  return userInfo;
});

export default orchestrator;
