'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { SQSClient } = require('@aws-sdk/client-sqs');

const { Notification } = require('../lib');

const env = {
	JANIS_SERVICE_NAME: 'serviceName',
	NOTIFICATION_ACCOUNT_ID: '012345678901',
	SQS_BASE_URL: 'https://sqs.us-east-1.amazonaws.com'
};

describe('Notification', () => {

	beforeEach(() => {
		process.env = { ...env };
		sinon.stub(SQSClient.prototype, 'send').resolves(true);
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('When validation fails', () => {

		it('Should reject if JANIS_SERVICE_NAME is not defined', async () => {

			process.env.JANIS_SERVICE_NAME = '';

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send(), { message: 'JANIS_SERVICE_NAME variable is not defined' });
		});

		it('Should reject if SQS_BASE_URL is not defined', async () => {

			process.env.SQS_BASE_URL = '';

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send(), { message: 'SQS_BASE_URL variable is not defined' });
		});

		it('Should reject if NOTIFICATION_ACCOUNT_ID is not defined', async () => {

			process.env.NOTIFICATION_ACCOUNT_ID = '';

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send(), { message: 'NOTIFICATION_ACCOUNT_ID variable is not defined' });
		});

		it('Should reject if not passing notification parameter in send method', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send());
		});

		it('Should reject if not passing notification.event in send method parameter', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send({ entity: 'entityName', body: { id: '132456' } }));
		});

		it('Should reject if not passing notification.entity in send method parameter', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send({ event: 'eventName', body: { id: '132456' } }));
		});

		['event', 'entity', 'body'].forEach(property => {

			it(`Should reject if passing invalid notification.${property} in send method parameter`, async () => {

				const notificationInstance = new Notification();

				await assert.rejects(notificationInstance.send({
					event: 'eventName',
					entity: 'entityNmae',
					body: { id: '132456' },
					[property]: null
				}));
			});

		});

	});

	describe('When validation does not fail', () => {

		const notificationSample = {
			event: 'eventName',
			entity: 'entityName',
			body: { id: '132456' }
		};

		const inputSample = {
			MessageBody: '{"event":"eventName","entity":"entityName","body":{"id":"132456"},"service":"serviceName"}',
			QueueUrl: 'https://sqs.us-east-1.amazonaws.com/012345678901/NotificationMessageProcessorQueue'
		};

		it('Should send the notification successfully (without clientCode)', async () => {

			const notificationInstance = new Notification();

			await notificationInstance.send(notificationSample);

			sinon.assert.calledOnceWithExactly(SQSClient.prototype.send, sinon.match({ input: inputSample }));
		});

		it('Should send the notification successfully (with clientCode)', async () => {

			const notificationInstance = new Notification();

			await notificationInstance.send(notificationSample, 'defaultClient');

			sinon.assert.calledOnceWithExactly(SQSClient.prototype.send, sinon.match({
				input: {
					...inputSample,
					MessageAttributes: {
						'janis-client': {
							StringValue: 'defaultClient',
							DataType: 'String'
						}
					}
				}
			}));
		});

	});

});
