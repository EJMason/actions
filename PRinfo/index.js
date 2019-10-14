const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const myToken = core.getInput('token')
        const owner = core.getInput('owner')
        const repo = core.getInput('repo')

        const octokit = new github.GitHub(myToken)

        const { data: pullRequest } = await octokit.pulls.list({
            owner,
            repo,
            state: 'open',
        })

        const goodPrs = pullRequest.filter((pri) => pri.labels.filter((label) => label.name === 'dependabot').length > 0)

        core.debug(`Number of PR that need triage: ${goodPrs.length}`)

        if (!goodPrs) {
            core.setFailed('No Pull Requests Match!')
        }
        if (goodPrs.length > 1) {
            core.setFailed('Too many good Pull Requests!')
        }

        const pr = goodPrs[0]

        const branch = pr.head.ref
        const description = pr.body
        const external_link = pr.html_url
        const title = pr.title.replace(':robot: ', '')
        const pr_number = pr.number

        core.debug(`    PR Number: ${pr_number}`)
        core.debug(`  Branch Name: ${branch}`)
        core.debug(`External Link: ${external_link}`)
        core.debug(`        Title: ${title}`)

        core.setOutput('branch_name', branch)
        core.setOutput('pr_title', title)
        core.setOutput('pr_decription', description)
        core.setOutput('pr_external_link', external_link)
        core.setOutput('pr_number', pr_number)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }
}

run()
