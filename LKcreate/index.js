const core = require('@actions/core')
const github = require('@actions/github')
const got = require('got')

async function run() {
    try {
        // This should be a token with access to your repository scoped in as a secret.
        // The YML workflow will need to set myToken with the GitHub Secret Token
        // myToken: ${{ secrets.GITHUB_TOKEN }
        // https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
        const myToken = core.getInput('GITHUB_TOKEN')

        const octokit = new github.GitHub(myToken)

        const { data: pullRequest } = await octokit.pulls.list({
            owner: 'EJMason',
            repo: 'test-dependabot',
            state: 'open',
        })

        console.log(pullRequest)
        console.log()

        const pr = pullRequest[0]

        // const card_type = core.getInput(LK_TYPE) // Card type - defect/risk
        // const lane = core.getInput(LK_LANE) // triage lane id
        // const lk_url = core.getInput(LK_URL) // triage lane id
        // const lk_board = core.getInput(LK_BOARD) // triage lane id
        // const lk_token = core.getInput(LK_TOKEN)

        const lk_card_type = core.getInput(LK_TYPE_DEV) // Card type - defect/risk
        const lane = core.getInput(LK_LANE_DEV) // triage lane id
        const lk_url = core.getInput(LK_URL_DEV) // triage lane id
        const lk_board = core.getInput(LK_BOARD_DEV) // triage lane id
        const lk_token = core.getInput(LK_TOKEN_DEV)

        const header = 'Dependabot'
        const title = pr.title.replace(':robot: ', '')
        const description = pr.body
        const external_link = pr.html_url
        const external_link_title = 'Pull Request'

        // create the card

        // const item = await got(`${lk_url}/card`, {
        //     headers: {
        //         Authorization: `Bearer ${lk_token}`,
        //     },
        //     body: {
        //         boardId: lk_board, // required
        //         title: title, // required
        //         typeId: lk_card_type,
        //         laneId: lane,
        //         description: description,
        //         externalLink: {
        //             label: external_link_title,
        //             url: external_link,
        //         },
        //         customId: header,
        //     },
        // })
        // console.log('---------- REQUEST SUCCESS! -------------')
        // console.log()
        // console.log(item)
    } catch (error) {
        console.log('-------------------err-------------------')
        console.log(error)
        core.setFailed(`Action failed, ${error}`)
    }

    // Next task is to ammend the commit, Need the lk link, info about the commit
    // core.setOutput()
}

run().catch((err) => {
    console.log('-------------------err-------------------')
    console.log(err)
    process.exit(1)
})

// card format
/*

Header                  Dependabot
Card Type               Defect / Risk
Title                   PR Title, less emoji
Description             PR Body, less commands?
External Link           PR, name: Pull Request
Lane                    Triage

*/
