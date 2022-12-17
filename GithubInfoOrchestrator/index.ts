import * as df from "durable-functions";

const orchestrator = df.orchestrator(function* (context) {
  const userId: string = yield context.df.callActivity(
    "GetRepositoryDetailsByName",
    context.bindingData.input
  );

  // Chaining response from first actitity trigger to next actitity
  context.bindingData.input = userId;

  context.log("OE ==>", userId, context.bindingData.input);

  const userInfo = yield context.df.callActivity(
    "GetUserDetailsById",
    context.bindingData.input
  );
  return userInfo;
});

export default orchestrator;
