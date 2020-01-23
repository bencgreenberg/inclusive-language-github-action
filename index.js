const { languageList } = require('./data/language');
const { Toolkit } = require('actions-toolkit')

let user = '';
let title = '';
let body = '';
// Run your GitHub Action!
Toolkit.run(async tools => {
  const owner = tools.context.payload.repository.owner.login;
  const repo = tools.context.payload.repository.name;

  const expected_events = ['opened', 'edited', 'reopened']

  if (expected_events.includes(tools.context.payload.action) && tools.context.payload.issue) {
    // Issue details
    console.log("ISSUE!")
    const action = tools.context.payload.issue.action
    title = tools.context.payload.issue.title
    user = tools.context.payload.issue.user
    body = tools.context.payload.issue.body
    const issue_number = tools.context.payload.issue.number
  } else if (expected_events.includes(tools.context.payload.action) && tools.context.payload.pull_request) {
  // Pull Request details
    console.log("PULL REQUEST!")
    const action = tools.context.payload.pull_request.action
    title = tools.context.payload.pull_request.title
    user = tools.context.payload.pull_request.user
    body = tools.context.payload.pull_request.body
  }
  console.log("TITLE: ", title);
  console.log("BODY:", body);

  // Combine title and body and split into array of substrings
  let combined_string = `${title} ${body}`.toLowerCase();
  let combined_array = combined_string.split(" ");
  console.log("ALL THE TEXT!", combined_string);
  console.log("ALL THE TEXT!", combined_array);

  let errorFound = false;
  for (let word of combined_array) {
    errorFound = errorFound || (languageList.indexOf(word) != -1);
  }

  // Check if text includes anything from language list
  if (errorFound) {
    await tools.github.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      body: inclusionMsg
    });
  } else {
    console.log("No language violations found!");
  }
});

const inclusionMsg = `
  Hi there, ${user}! 👋
  \n\n
  We are happy to see you being active in our GitHub organization and want to encourage that activity!\n
  We are also mindful of cultivating an inclusive space and encourage you to avoid language that detracts from
  that inclusivity. Words such as "guys", "dumb" and "crazy" detract from the overall culture where everyone feels valued
  and appreciated in our community.\n
  Please review your recent contribution and revise for inclusivity.\n
  If you are interested in reading more, we recommend this guide from the Government of British Columbia: 
  https://www2.gov.bc.ca/assets/gov/careers/all-employees/working-with-others/words-matter.pdf
  \n\n
  Thank you for helping us create a space where all want to contribute! 💙
`;
