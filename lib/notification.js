'use strict';

const { struct } = require('@janiscommerce/superstruct');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const serverlessConfiguration = require('./serverless-configuration');

const QUEUE_NAME = 'NotificationMessageProcessorQueue';

const notificationStruct = struct.partial({
	event: 'string',
	entity: 'string',
	userId: 'objectId?',
	body: 'object?'
});

module.exports = class Notification {

	constructor(config) {
		this.client = new SQSClient(config);
	}

	static get serverlessConfiguration() {
		return serverlessConfiguration();
	}

	get serviceName() {
		return process.env.JANIS_SERVICE_NAME;
	}

	get notificationAccountId() {
		return process.env.NOTIFICATION_ACCOUNT_ID;
	}

	get sqsBaseUrl() {
		return process.env.SQS_BASE_URL;
	}

	get queueUrl() {
		return `${this.sqsBaseUrl}/${this.notificationAccountId}/${QUEUE_NAME}`;
	}

	async send(notification, clientCode) {

		this.validate(notification);

		const command = new SendMessageCommand({
			MessageBody: JSON.stringify({ ...notification, service: this.serviceName }),
			QueueUrl: this.queueUrl,
			...clientCode && {
				MessageAttributes: {
					'janis-client': {
						StringValue: clientCode,
						DataType: 'String'
					}
				}
			}
		});

		return this.client.send(command);
	}

	validate(notification) {

		if(!this.serviceName)
			throw new Error('JANIS_SERVICE_NAME variable is not defined');

		if(!this.sqsBaseUrl)
			throw new Error('SQS_BASE_URL variable is not defined');

		if(!this.notificationAccountId)
			throw new Error('NOTIFICATION_ACCOUNT_ID variable is not defined');

		const [error] = notificationStruct.validate(notification);

		if(error)
			throw new Error(error);
	}

};
