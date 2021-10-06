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

# Event Handler

### Install

````sh
cd YOUR_WORKING_DIRECTORY/casper-dashboad/event-handler
npm install

### Usage

Change your MongoDB configuration in config/db-config.json file.

```sh
npm start
````
