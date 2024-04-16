/* eslint-disable no-template-curly-in-string */

'use strict';

module.exports = notificationAccountId => [

	['envVars', {
		SQS_BASE_URL: 'https://sqs.${aws:region}.amazonaws.com',
		NOTIFICATION_ACCOUNT_ID: notificationAccountId
	}],

	['iamStatement', {
		action: ['sqs:SendMessage'],
		resource: `arn:aws:sqs:\${aws:region}${notificationAccountId}:*`
	}]

];
