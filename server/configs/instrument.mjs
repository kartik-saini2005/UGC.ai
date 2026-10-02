import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://3e60665f343aee6c3dc517bc01e8a1c0@o4511833986498560.ingest.us.sentry.io/4511834023133184",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    //  https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    //  userInfo: false,
    //  httpBodies: [],
  },
});