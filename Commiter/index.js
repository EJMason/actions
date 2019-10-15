const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const myToken = core.getInput('token')
        const owner = core.getInput('owner')
        const repo = core.getInput('repo')

        const octokit = new github.GitHub(myToken)

        const commits = await octokit.pulls.listCommits({
            owner,
            repo,
            pull_number: pr.number,
        })

        console.log(commits)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }
}

run()
