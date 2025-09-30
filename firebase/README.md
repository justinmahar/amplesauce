# ⚙️ Gatsby Launchpad Firebase

This project contains the Firestore rules and cloud functions used by Gatsby Launchpad (gatsby-launchpad).

- [View Cloud Functions in Firebase](https://console.firebase.google.com/u/0/project/gatsby-launchpad/functions)
- [View Firestore Rules](https://console.firebase.google.com/u/0/project/gatsby-launchpad/firestore/rules)
- [View Console Logs](https://console.cloud.google.com/logs/viewer?authuser=0&project=gatsby-launchpad)

### Installation

Make sure the `firebase-tools` CLI is installed globally.

```
npm install -g firebase-tools
```

For functions installation, run `npm install` in the `functions` directory.

### Emulators

#### Functions Only

```
cd functions
npm run serve
```

#### All Emulators

```
npm run emulators
```

### Deployment

First, log in to firebase.

```
firebase login
```

#### Rules Deploy

Run this command in the project root.

```
npm run deploy-rules
```

#### Functions Deploy

Run this command in the `functions` dir.

```
npm run deploy-functions
```

### Configuring Firebase and Feed Service Accounts

- In the [Firebase Console](https://console.firebase.google.com/), open Project Settings -> Service accounts.
- Generate a new private key, save it to your desktop
- Copy the key to the clipboard.
- Open a browser and open the developer console.
- Convert the service key JSON to a string using `JSON.stringify(paste_here);`
- Copy the output, paste in a new code editor window. Change all `"` to `\"` and surround the whole thing in double quotes instead of single quotes.
- Run the following:

  App Firebase:
  ```
  firebase functions:config:set app.serviceaccountjson=PASTE_HERE
  ```

  Feed Firebase:
  ```
  firebase functions:config:set feed.serviceaccountjson=PASTE_HERE
  ```

- Pull in the latest config by running: `cd functions && npm run get-config`

### Configured Environment Variables

- `app.serviceaccountjson` - Service account JSON for the app.
  - To create this, stringify the JSON, escape all double quotes with backslash, and set it via `firebase functions:config:set app.serviceaccountjson="API JSON STRING"`.

- `feed.serviceaccountjson` - Service account JSON for the [feed station](https://console.firebase.google.com/u/0/project/feed-station/settings/serviceaccounts/adminsdk). Used for stats and the activity feed.
  - To create this, stringify the JSON, escape all double quotes with backslash, and set it via `firebase functions:config:set feed.serviceaccountjson="API JSON STRING"`.

### Setting/Getting Environment Variables

In the terminal, navigate to `/functions`.

#### Set them using:

```
firebase functions:config:set example.key="THE API KEY"
```

You can set multiple values at once.

> After running `functions:config:set`, you must redeploy functions to make the new configuration available.

See the [docs on environment config](https://firebase.google.com/docs/functions/config-env#set_environment_configuration_for_your_project).

#### Get them using:

```
firebase functions:config:get > .runtimeconfig.json
```

There is also an npm script for doing this: 

```
npm run get-config
```

#### Unsetting

```
firebase functions:config:unset key1 key2
```

### Resourcess

- Start writing Firebase Functions -- https://firebase.google.com/docs/functions/typescript
- Configure env vars -- https://firebase.google.com/docs/functions/config-env