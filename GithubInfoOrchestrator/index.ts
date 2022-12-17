import * as df from "durable-functions";

const orchestrator = df.orchestrator(function* (context) {
  const firstRetryIntervalInMilliseconds: number = 1000;
  const maxNumberOfAttempts: number = 3;
  const maxRetryIntervalInSeconds: number = 1000;
  const retryTimeoutInMilliseconds: number = 7000;

  const retryConfig: df.RetryOptions = new df.RetryOptions(
    firstRetryIntervalInMilliseconds,
    maxNumberOfAttempts
  );
  retryConfig.maxRetryIntervalInMilliseconds = maxRetryIntervalInSeconds;
  retryConfig.retryTimeoutInMilliseconds = retryTimeoutInMilliseconds;

  const userId: string = yield context.df.callActivityWithRetry(
    "GetRepositoryDetailsByName",
    retryConfig,
    context.bindingData.input
  );

  // Chaining response from first actitity trigger to next actitity
  context.bindingData.input.userId = userId;

  const userInfo = yield context.df.callActivityWithRetry(
    "GetUserDetailsById",
    retryConfig,
    context.bindingData.input
  );
  return userInfo;
});

export default orchestrator;
