'use strict';

module.exports = () => [

	['envVars', {
		// eslint-disable-next-line no-template-curly-in-string
		SQS_BASE_URL: 'https://sqs.${aws:region}.amazonaws.com',
		NOTIFICATION_ACCOUNT_ID: process.env.NOTIFICATION_ACCOUNT_ID
	}],

	['iamStatement', {
		action: ['sqs:SendMessage'],
		resource: `arn:aws:sqs:\${aws:region}:${process.env.NOTIFICATION_ACCOUNT_ID}:*`
	}]

];
