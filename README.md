<<<<<<< HEAD
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />

### Step to run event handler

```
cd event-handler
npm i
npm run dev

```

You can view the developement database in event-handler/developement_sqlite.db
=======
# Welcome to Casper Dash 👋

![](https://i.imgur.com/S9p3Aob.png)

> A web wallet for Casper blockchain

### 🏠 [casperdash.io ](casperdash.io) ( beta )

## Features/Road map

-   [x] Integrate with Casper Singer
-   [x] Dashboad
    -   [x] View CSPR balance
    -   [x] Send/Receive CRPR
    -   [x] CRPS price chart
-   [x] Tokens (ERC20)
    -   [x] View token info/balance
    -   [x] Send/Receive tokens
    -   [x] Add custom token by contract hash
-   [x] History
    -   [x] View transfer transactions history
-   [ ] Keys Manager
    -   [x] Deploy keys manager contract
    -   [x] Edit account weight
    -   [x] Edit Deployment/ Key management threshold
    -   [x] Add new associated key
    -   [ ] Edit associated account weight
-   [ ] Stacking
    -   [ ] Stacking CSPR
-   [ ] Account management
    -   [ ] Create/update/manage public/private keys
    -   [ ] Import/backup account from private key file or mnemonic words
    -   [ ] Provide method to sign contract from external site

#### Will be on separated repository

-   [ ] Web extension wallet
-   [ ] IOS app
-   [ ] Android app

### Built With

-   [React.js](https://reactjs.org/)
-   [Nodejs](https://nodejs.org/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

-   npm >= 7.24
-   nodejs >= 12

# Client

### Install

```sh
cd YOUR_WORKING_DIRECTORY/casper-dashboad/client
npm install
```

### Usage

Update API endpoint at `src/constants/key.js`

```shell
npm start
```

# API

### Install

```sh
cd YOUR_WORKING_DIRECTORY/casper-dashboad/server
npm install
```

### Usage

RPC url can be updated at `.env` or `constants/index.js`

```sh
npm start
```
>>>>>>> df2e9c5a379e100819665c76a1fc037437144319
