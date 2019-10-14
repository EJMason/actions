const core = require('@actions/core')
const got = require('got')

const prefix = 'https://spacecat.leankit.com/card/'

async function run() {
    try {
        const card_type = core.getInput('lkType') // Card type - defect/risk
        const lane = core.getInput('lkLane') // triage lane id
        const lk_url = core.getInput('lkUrl') // triage lane id
        const lk_board = core.getInput('lkBoard') // triage lane id
        const lk_token = core.getInput('lkToken')

        const pr_title = core.getInput('pr_title')
        const pr_description = core.getInput('pr_description')
        const pr_external_link = core.getInput('pr_external_link')

        const header = 'Dependabot'
        const external_link_title = 'Pull Request'

        // create the card

        const response = await got.post(`${lk_url}/card`, {
            headers: {
                Authorization: `Bearer ${lk_token}`,
            },
            body: {
                boardId: lk_board, // required
                title: pr_title, // required
                typeId: card_type,
                laneId: lane,
                description: pr_description,
                externalLink: {
                    label: external_link_title,
                    url: pr_external_link,
                },
                customId: header,
            },
            json: true,
        })

        core.setOutput('lk_url', `${prefix}${response.body.id}`)
    } catch (error) {
        core.setFailed(`Action failed, ${error}`)
    }
}

run()
