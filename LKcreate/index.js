const core = require('@actions/core')
const github = require('@actions/github')
const got = require('got')

async function run() {
    try {
        const myToken = core.getInput('token')
        const octokit = new github.GitHub(myToken)

        const { data: pullRequest } = await octokit.pulls.list({
            owner: 'EJMason',
            repo: 'test-dependabot',
            state: 'open',
        })

        const pr = pullRequest[0]

        const card_type = core.getInput('lkType') // Card type - defect/risk
        const lane = core.getInput('lkLane') // triage lane id
        const lk_url = core.getInput('lkUrl') // triage lane id
        const lk_board = core.getInput('lkBoard') // triage lane id
        const lk_token = core.getInput('lkToken')

        const header = 'Dependabot'
        const title = pr.title.replace(':robot: ', '')
        const description = pr.body
        const external_link = pr.html_url
        const external_link_title = 'Pull Request'

        // create the card

        const response = await got.post(`${lk_url}/card`, {
            headers: {
                Authorization: `Bearer ${lk_token}`,
            },
            body: {
                boardId: lk_board, // required
                title: title, // required
                typeId: card_type,
                laneId: lane,
                description: description,
                externalLink: {
                    label: external_link_title,
                    url: external_link,
                },
                customId: header,
            },
            json: true,
        })
        console.log(response.body)
        console.log('====================')
        console.log('id: ', response.body.id)
        console.log('url: ', lk_url)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }

    // Next task is to ammend the commit, Need the lk link, info about the commit
    // core.setOutput()
}

run()

// card format
/*

Header                  Dependabot
Card Type               Defect / Risk
Title                   PR Title, less emoji
Description             PR Body, less commands?
External Link           PR, name: Pull Request
Lane                    Triage

*/
