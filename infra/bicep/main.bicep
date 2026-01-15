@description('Name of the Cosmos DB account to create')
param accountName string

@description('Azure region for the Cosmos account')
param location string = resourceGroup().location

@description('Logical database id (base, Bicep will append envSuffix when provided)')
param databaseId string

@description('Optional environment suffix appended to container names (e.g. "_staging")')
param envSuffix string = ''

@description('If set, will configure database throughput (RU/s). Use 0 to skip setting throughput at DB level.')
param databaseThroughput int = 0

// Load the shared schema JSON file (single source of truth)
var schema = json(loadTextContent('../cosmos/cosmos-schema.json'))
var containers = schema.containers

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: accountName
  location: location
  kind: 'GlobalDocumentDB'
  identity: {
    type: 'None'
  }
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}

// SQL database resource (optionally set throughput)
resource sqlDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2021-04-15' = {
  parent: cosmos
  name: '${databaseId}${envSuffix}'
  properties: {
    resource: {
      id: '${databaseId}${envSuffix}'
    }
    options: databaseThroughput != 0 ? {
      throughput: databaseThroughput
    } : {}
  }
}
// Create containers described in the shared schema; append envSuffix to container names
resource containersRes 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2021-04-15' = [for c in containers: {
  name: '${cosmos.name}/${databaseId}${envSuffix}/${c.name}${envSuffix}'
  dependsOn: [sqlDb]
  properties: {
    resource: {
      id: '${c.name}${envSuffix}'
      partitionKey: {
        paths: [c.partitionKey]
        kind: 'Hash'
      }
      defaultTtl: c.?defaultTtl ?? -1
      indexingPolicy: c.?indexingPolicy ?? {}
    }
  }
  
}]

output cosmosAccountName string = cosmos.name
output databaseName string = sqlDb.name
