const core = require('@actions/core')
const github = require('@actions/github')
const got = require('got')

const prefix = 'https://spacecat.leankit.com/card/'

async function run() {
    try {
        const myToken = core.getInput('token')
        const octokit = new github.GitHub(myToken)

        const { data: pullRequest } = await octokit.pulls.list({
            owner: 'EJMason',
            repo: 'test-dependabot',
            state: 'open',
        })

        const goodPrs = pullRequest.filter((pri) => pri.labels.filter((label) => label.name === 'dependabot').length > 0)

        console.log(goodPrs)

        // const commits = await octokit.pulls.listCommits({
        //     owner: 'EJMason',
        //     repo: 'test-dependabot',
        //     pull_number: pr.number,
        // })

        // console.log('=========== commits ==============')
        // console.log(commits.data[0].commit)

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
        console.log('Card Created ---> ')
        console.log(`${prefix}${response.body.id}`)

        core.setOutput('lk_url', `${prefix}${response.body.id}`)
        core.setOutput('commit_message', commits[0].commit.message)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }
}

run()
