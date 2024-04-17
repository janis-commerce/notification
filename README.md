# notification

A package to send notifications to Janis Notification service

## Installation

```sh
npm install @janiscommerce/notification
```

### Configuration

To use the notification package, first use the ServerlessConfiguration function to set some iamStatement and environment variables within the serverless hooks.

```js

const { helper } = require('sls-helper');

const { ServerlessConfiguration } = require('@janiscommerce/notification');

const functions = require('./serverless/functions');

// const NOTIFICATION_ACCOUNT_ID = Setting.get() || process.env.variableName;

module.exports = helper({
	hooks: [
		...otherHooks,

		// The package use `process.env.NOTIFICATION_ACCOUNT_ID` variable required and the account id is different in each environment.
		...ServerlessConfiguration(NOTIFICATION_ACCOUNT_ID),

		...functions
	]
});
```

### Usage

```js
const { Notification } = require('@janiscommerce/notification');
```
#### Method of use

*async* **send(*notification*, *clientCode*)**

Method for send notification to Notification Service

**Parameters**

- **notification**(*Required|Object*) - Notification object data
- - **event** (*Required|String*) - Event notification identifier
- - **entity** (*Required|String*) - Service entity name
- - **body** (*Optional|Object*) - Additional notification data

- **clientCode**(*Optional|String*) - ClientCode to inject in notification

#### Example

```js
const { Notification } = require('@janiscommerce/notification');

const notificationSample = {
	event: 'ready',
	entity: 'entity',
	body: {
		id: '5de565c07de99000110dcdef',
		moreData: {
			name: 'test',
			number: 1234
		}
	}
};

const notificationInstance = new Notification();

// Without clientCode
await notificationInstance.send(notificationSample);

// With clientCode
await notificationInstance.send(notificationSample, clientCode);

```

Additionally, the property ***service*** with the service name is automatically added to the notification.