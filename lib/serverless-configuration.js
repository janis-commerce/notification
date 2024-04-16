/* eslint-disable no-template-curly-in-string */

'use strict';

module.exports = () => [

	['envVars', {
		SQS_BASE_URL: 'https://sqs.${aws:region}.amazonaws.com'
	}],

	['iamStatement', {
		action: ['sqs:SendMessage'],
		resource: `arn:aws:sqs:\${aws:region}${process.env.NOTIFICATION_ACCOUNT_ID}:*`
	}]

];
