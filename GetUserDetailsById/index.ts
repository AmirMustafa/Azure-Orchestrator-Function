import { AzureFunction, Context } from "@azure/functions";
import { Octokit } from "@octokit/core";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<any> {
  const octokit = new Octokit();

  context.log("context binding GetUserDetailsById ==> ", context.bindingData);
  const apiPath = `/users/${context.bindingData.userId?.toString()}`;
  const searchResult = await octokit.request(apiPath);
  const userData = <JSON>searchResult.data;
  return userData;
};

export default activityFunction;
