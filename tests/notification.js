/* eslint-disable no-template-curly-in-string */

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

	let oldEnv;

	beforeEach(() => {

		oldEnv = { ...process.env };

		Object.entries(env).forEach(([key, value]) => {
			process.env[key] = value;
		});

		sinon.stub(SQSClient.prototype, 'send').resolves(true);
	});

	afterEach(() => {
		process.env = oldEnv;
		sinon.restore();
	});

	it('Should return expected configuration', () => {

		const SQS_BASE_URL = 'https://sqs.${aws:region}.amazonaws.com';

		process.env.SQS_BASE_URL = SQS_BASE_URL;

		assert.deepEqual(Notification.serverlessConfiguration, [
			['envVars', {
				SQS_BASE_URL,
				NOTIFICATION_ACCOUNT_ID: env.NOTIFICATION_ACCOUNT_ID
			}],

			['iamStatement', {
				action: ['sqs:SendMessage'],
				resource: `arn:aws:sqs:\${aws:region}:${env.NOTIFICATION_ACCOUNT_ID}:*`
			}]
		]);
	});

	describe('When validation fails', () => {

		Object.keys(env).forEach(envVarName => {
			it(`Should reject if ${envVarName} is not defined`, async () => {

				process.env[envVarName] = '';

				const notificationInstance = new Notification();

				await assert.rejects(notificationInstance.send(), { message: `${envVarName} variable is not defined` });
			});
		});

		it('Should reject if notification parameter is not passed to send method', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send());
		});

		it('Should reject if notification.event is not passed to send method as parameter', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send({ entity: 'entityName', body: { id: '132456' } }));
		});

		it('Should reject if notification.entity is not passed to send method as a parameter', async () => {

			const notificationInstance = new Notification();

			await assert.rejects(notificationInstance.send({ event: 'eventName', body: { id: '132456' } }));
		});

		['event', 'entity', 'body'].forEach(property => {

			it(`Should reject if invalid notification.${property} is passed to send method as parameter`, async () => {

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

		it('Should send the notification successfully (with clientCode and userId)', async () => {

			const notificationInstance = new Notification();

			await notificationInstance.send({ ...notificationSample, userId: '65cd1b55c64236fcc641ddcf' }, 'defaultClient');

			sinon.assert.calledOnceWithExactly(SQSClient.prototype.send, sinon.match({
				input: {
					...inputSample,
					MessageBody: '{"event":"eventName","entity":"entityName","body":{"id":"132456"},"userId":"65cd1b55c64236fcc641ddcf","service":"serviceName"}',
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
