const core = require('@actions/core')
const github = require('@actions/github')

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet')
    console.log(`Hello ${nameToGreet}!`)
    const time = new Date().toTimeString()
    core.setOutput('time', time)
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)
} catch (error) {
    core.setFailed(error.message)
}

async function run() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }
    // https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
    const myToken = core.getInput('GH_TOKEN')

    const octokit = new github.GitHub(myToken)

    const { data: pullRequest } = await octokit.pulls.list({
        owner: 'EJMason',
        repo: 'test-dependabot',
        state: 'open',
    })

    console.log(pullRequest)
}

run()
