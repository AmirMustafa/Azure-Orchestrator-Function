import { AzureFunction, Context } from "@azure/functions";
import { Octokit } from "@octokit/core";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<string> {
  // if (
  //   context.bindingData.raiseException &&
  //   context.bindingData.raiseException === true
  // ) {
  //   context.log("Error enforced by caller");
  //   throw {
  //     name: "ForcedException",
  //     message: "Caller enforced exception",
  //     toString: function () {
  //       return this.name + ": " + this.message;
  //     },
  //   };
  // }

  await sleep(7000);

  const octokit = new Octokit();

  const query = `${context.bindingData.repositoryName.toString()} in:name`;
  const searhResult = await octokit.request("GET /search/repositories", {
    q: query,
  });

  context.log(
    "respository name ===> ",
    context.bindingData.repositoryName,
    context.bindingData
  );

  context.bindingData.repositoryName = context.bindingData.repositoryName;
  context.log("search data ==>", searhResult);

  const exactMatch = searhResult.data.items.find(
    (item) => item.name === context.bindingData.repositoryName.toString()
  );
  context.log("exactMatch ==>", exactMatch);
  context.bindingData.repositoryName = context.bindingData.repositoryName;
  return exactMatch.owner.login;
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default activityFunction;
