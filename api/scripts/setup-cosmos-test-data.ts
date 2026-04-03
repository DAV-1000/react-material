// setup-cosmos-test-data.ts

import { CosmosClient } from '@azure/cosmos';

const endpoint = 'your-cosmos-db-endpoint';
const key = 'your-cosmos-db-key';
const databaseId = 'your-database-id';
const containerId = 'your-container-id';

const client = new CosmosClient({ endpoint, key });

async function setupTestData() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });

    const testItems = [
        { id: '1', name: 'Test Item 1', description: 'This is test item 1.' },
        { id: '2', name: 'Test Item 2', description: 'This is test item 2.' },
        { id: '3', name: 'Test Item 3', description: 'This is test item 3.' }
    ];

    for (const item of testItems) {
        await container.items.upsert(item);
    }

    console.log('Test data has been set up successfully.');
}

setupTestData().catch((error) => {
    console.error('Error setting up test data:', error);
});
