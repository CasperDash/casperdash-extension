import config from '@cd/config';
import { getVersion } from '@cd/helpers/key';
import * as Sentry from '@sentry/browser';
import { Dedupe as DedupeIntegration } from "@sentry/integrations";

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
            error.message.match(/Your account has not been created/i)
          ) {

            return null;
          }

          return event;
        },
        integrations: [
          new DedupeIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
};