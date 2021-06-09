## instructions
in root folder run
```
yarn install
```

in ios folder
```
cd ios
pod install
```

the gql host is set in `app/util/client.js` on line 85. This should be
moved to a env variable but for dev im just switching it manaully.
 - For local development, start the gql server app (other repo) and use http://localhost:4000
 - For external/expo use the google app engine url (mine was https://j5s-dev.uc.r.appspot.com/)



## credential
 - firebase. This is used for auth and db. you will need to create a firebase account
 on firebase.google.com and update the credentials in app.json as well as in the

