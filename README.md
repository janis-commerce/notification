# notification

![Build Status](https://github.com/janis-commerce/notification/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/notification/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/notification?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fnotification.svg)](https://www.npmjs.com/package/@janiscommerce/notification)

A package to send notifications to Janis Notification service

## Installation

```sh
npm install @janiscommerce/notification
```

### Configuration

To use the notification package, first use the Notification.serverlessConfiguration function to set some iamStatement and environment variables within the serverless hooks.

```js

const { helper } = require('sls-helper');

const { Notification } = require('@janiscommerce/notification');

const functions = require('./serverless/functions');

module.exports = helper({
	hooks: [
		...otherHooks,

		...Notification.serverlessConfiguration,

		...functions
	]
});
```

### ENV variables

- **JANIS_SERVICE_NAME** (required): The name of the service.
- **NOTIFICATION_ACCOUNT_ID** (required) - The notification service account id.
- **SQS_BASE_URL** (required) - SQS base url. This variable is set by ***Notification.serverlessConfiguration***

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
- - **userId** (*Optional|String*) - User Id
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