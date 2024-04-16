'use strict';

module.exports = notificationAccountId => [

	['envVars', {
		// eslint-disable-next-line no-template-curly-in-string
		SQS_BASE_URL: 'https://sqs.${aws:region}.amazonaws.com',
		NOTIFICATION_ACCOUNT_ID: notificationAccountId
	}],

	['iamStatement', {
		action: ['sqs:SendMessage'],
		resource: `arn:aws:sqs:\${aws:region}${notificationAccountId}:*`
	}]

];
