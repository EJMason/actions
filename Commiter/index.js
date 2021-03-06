const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const myToken = core.getInput('token')
        const owner = core.getInput('owner')
        const repo = core.getInput('repo')
        const pr_number = core.getInput('pr_number')

        const octokit = new github.GitHub(myToken)

        const commits = await octokit.pulls.listCommits({
            owner,
            repo,
            pull_number: pr_number,
        })

        console.log(commits.data)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }
}

run()
