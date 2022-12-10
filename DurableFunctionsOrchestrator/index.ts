import * as df from "durable-functions";

const orchestrator = df.orchestrator(function* (context) {
  const outputs = [];

  // Replace "Hello" with the name of your Durable Activity Function.
  outputs.push(yield context.df.callActivity("HelloCity", "Tokyo"));
  outputs.push(yield context.df.callActivity("HelloCity", "Seattle"));
  outputs.push(yield context.df.callActivity("HelloCity", "London"));

  // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
  return outputs;
});

export default orchestrator;
