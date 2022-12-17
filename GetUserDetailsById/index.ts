import { AzureFunction, Context } from "@azure/functions";
import { Octokit } from "@octokit/core";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<any> {
  const octokit = new Octokit();

  const apiPath = `/users/${context.bindingData.name?.toString()}`;
  const searchResult = await octokit.request(apiPath);
  const userData = <JSON>searchResult.data;
  return userData;
};

export default activityFunction;
