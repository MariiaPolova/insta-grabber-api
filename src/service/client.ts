import { ApifyClient } from 'apify-client';

let client: ApifyClient;
const clientId = process.env.APIFY_ACTOR_ID || 'default-actor-id';

async function initClient() {
    if (client) return;
    // Initialize the ApifyClient with API token
    client = new ApifyClient({
        token: process.env.DB_TOKEN,
    });

}

async function runClientActor(input: unknown) {
    // Run the Actor and wait for it to finish
    return client.actor(clientId).call(input);
}


async function listItems<T>(input: unknown): Promise<T[]> {
    // Run the Actor and wait for it to finish
    const run = await runClientActor(input);

    // Fetch and print Actor results from the run's dataset (if any)
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items as T[];
}

async function getLastRunItems() {
    try {
        const actorClient = client.actor(clientId);

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
        const actorClient = client.actor(clientId);

        // Select the last run of your Actor that finished
        // with a SUCCEEDED status.
        const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
        // Fetches items from the run's dataset.
        const actorRun = await lastSucceededRunClient.get();
        if (!actorRun) {
            console.error('No last run found');
            return '';
        }
        
        const buildId = actorRun.buildId;
        return buildId;
    } catch (error) {
        console.error('Error fetching last run data:', error);
        return '';
    }
}

export { initClient, listItems, getLastRunItems, getLastRunBuildId };

