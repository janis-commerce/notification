'use strict';

const assert = require('assert');

const { ServerlessConfiguration } = require('../lib');

describe('Serveless Configuration', () => {

	it('Should return expected configuration', () => {

		const NOTIFICATION_ACCOUNT_ID = '555555555555';

		const config = ServerlessConfiguration(NOTIFICATION_ACCOUNT_ID);

		assert.deepEqual(config, [
			['envVars', {
				// eslint-disable-next-line no-template-curly-in-string
				SQS_BASE_URL: 'https://sqs.${aws:region}.amazonaws.com',
				NOTIFICATION_ACCOUNT_ID
			}],

			['iamStatement', {
				action: ['sqs:SendMessage'],
				resource: `arn:aws:sqs:\${aws:region}${NOTIFICATION_ACCOUNT_ID}:*`
			}]
		]);
	});

});
