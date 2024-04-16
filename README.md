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

module.exports = helper({
	hooks: [
		...otherHooks,

		...ServerlessConfiguration(),

		...functions
	]
});
```
In addition to this, an environment variable must be set for the service notification account id.
The package use `process.env.NOTIFICATION ACCOUNT ID` variable required and the account id is different in each environment.

### Usage

```js
const { Notification } = require('@janiscommerce/notification');
```
#### Method of use

*async* **send(*notification*, *clientCode*)**

Method for send notification to Notification Service

**Parameters**

- **notification**(*Required|Object*) - Notification object data
- - **event** (*Required|String*)  - Event notification identifier
- - **body** (*Optional|Object*) - Additional notification data

- **clientCode**(*Optional|String*) - ClientCode to inject in notification

#### Example

```js
const { Notification } = require('@janiscommerce/notification');

const notificationSample = {
	event: 'service:entity:ready',
	body: {
		id: '5de565c07de99000110dcdef',
		moreData: {
			name: 'test',
			number: 1234
		}
	}
};

// Without clientCode
await Notfication.send(notificationSample);

// With clientCode
await Notfication.send(notificationSample, clientCode);

```