import config from '@cd/config';
import { getVersion } from '@cd/helpers/key';
import * as Sentry from '@sentry/browser';
import { Dedupe as DedupeIntegration } from "@sentry/integrations";
import { ERRORS } from '@cd/constants/errors';

const IGNORE_ERRORS = [
    ...Object.values(ERRORS),
];

export const setupSentry = () => {
    Sentry.init({
        dsn: config.SENTRY_DSN,
        environment: config.APP_ENVIRONMENT,
        release: 'casperdash-extension@' + getVersion(),
        beforeSend(event, hint) {
          const error = hint.originalException;
          if (
            error &&
            error.message &&
            error.message.match(new RegExp(IGNORE_ERRORS.join('|'), 'i'))
          ) {

            return null;
          }

          return event;
        },
        integrations: [
          new DedupeIntegration(),
        ],
    });
};