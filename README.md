![image](https://user-images.githubusercontent.com/44138832/122661880-6c827080-d1ac-11eb-9b0a-508d117ae3bc.png)

## Introduction

Google Docs Plus is a document editor as well as a real-time collaboration and sharing tool. Join a unique room as soon as you land and start typing. Just share the link to your friends and they can join in and collab too!

## Technology Stack & Concepts

- ReactJS
- Node.js
- Real-time collaboration using Socket.io
- Rich and unique text editor provided by Quill
- Document persistence using MongoDB Atlas

## Run This App Locally

Run the below command to install the dependencies

```sh
cd client && npm install
cd ../server && npm install
```

Go inside both the _client_ and _server_ folders run the below command to start them both

```sh
npm start
```

Go to the _server_ folder and create a _.env_ file with the following keys,

| Key            | Value                           |
| -------------- | ------------------------------- |
| CONNECTION_URI | your-mongo-atlas-connection-uri |
