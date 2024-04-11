'use strict';

const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

module.exports = class Notification {

	constructor(config) {
		this.client = new SQSClient(config);
	}

	get queueName() {
		return 'MessageProcessorQueue';
	}

	get notificationAccountId() {
		return process.env.NOTIFICATION_ACCOUNT_ID;
	}

	get sqsUrl() {
		return process.env.SQS_URL;
	}

	send(message, clientCode) {

		this.validateRequiredVariables();

		const command = new SendMessageCommand({
			MessageBody: JSON.stringify(message),
			QueueUrl: this.buildQueueUrl(),
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

	validateRequiredVariables() {

		if(!this.sqsUrl)
			throw new Error('SQS_URL variable is not defined');

		if(!this.notificationAccountId)
			throw new Error('NOTIFICATION_ACCOUNT_ID variable is not defined');
	}

	buildQueueUrl() {
		return `${this.sqsUrl}/${this.notificationAccountId}/${this.queueName}`;
	}

};
