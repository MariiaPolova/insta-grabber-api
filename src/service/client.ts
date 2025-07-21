import { ApifyClient } from 'apify-client';

let client;


async function initClient() {
    if (client) return;
    // Initialize the ApifyClient with API token
    client = new ApifyClient({
        token: process.env.DB_TOKEN,
    });

}

async function runClientActor(input) {
    // Run the Actor and wait for it to finish
    return client.actor(process.env.APIFY_ACTOR_ID).call(input);
}


async function listItems(input) {
    // Run the Actor and wait for it to finish
    const run = await runClientActor(input);

    // Fetch and print Actor results from the run's dataset (if any)
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items;
}

async function getLastRunItems() {
    try {
        const actorClient = client.actor(process.env.APIFY_ACTOR_ID);

        // Select the last run of your Actor that finished
        // with a SUCCEEDED status.
        const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
        // Fetches items from the run's dataset.
        const { items } = await lastSucceededRunClient.dataset()
            .listItems();

        console.log(items);
        return items;
    } catch (error) {
        console.error('Error fetching last run data:', error);
    }
}

async function getLastRunBuildId(): Promise<string> {
    try {
        const actorClient = client.actor(process.env.APIFY_ACTOR_ID);

        // Select the last run of your Actor that finished
        // with a SUCCEEDED status.
        const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
        // Fetches items from the run's dataset.
        const { buildId } = await lastSucceededRunClient.get();

        console.log(buildId);
        return buildId;
    } catch (error) {
        console.error('Error fetching last run data:', error);
    }
}

export { initClient, listItems, getLastRunItems, getLastRunBuildId };

