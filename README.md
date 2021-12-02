# Welcome to Casper Dash 👋

[![codecov](https://codecov.io/gh/CasperDash/casperdash-client/branch/develop/graph/badge.svg?token=3KWLVN3DPV)](https://codecov.io/gh/CasperDash/casperdash-client)

![](https://i.imgur.com/S9p3Aob.png)

> A web wallet for Casper blockchain

### 🏠 [casperdash.io ](casperdash.io) ( beta )

### <i class="fa fa-book fa-fw"></i> Document https://hackmd.io/@casperdash/r1wtIVYVt

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

## Architecture

![Casperdash architecture view](/doc/assets/architecture.png)

### Event Handler

Event handler is a NodeJS program that offers these following features:

-   Listen to the DeployProcessed event from a Casper Node.

-   Parse events and send them to MongoDB

-   [WIP] Retry the Casper Node connection if it drops

### Web Server

Web server is implemented in [Express.js](https://expressjs.com/). It allows us to create read-only data pipeline for clients.

Having multiple Web Servers helps to scale horizontally by serving equally the incoming traffic among instances.

### Client

React web app provides user a simple and convenient dashboard to explore the blocks and manipulate the wallets.

<!-- GETTING STARTED -->

## Development

### Prerequisites

-   mongodb > 4.4
-   npm >= 7.24
-   nodejs >= 12

# Common

Shared components and utils between the folders

Create your MongoDB configuration file db-config.json in YOUR_WORKING_DIRECTORY/casper-dashboad/common/config by copying the template file db-config.json.sample.

### Install

```sh
cd YOUR_WORKING_DIRECTORY/casper-dashboad/common
npm install
```

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

```sh
cd YOUR_WORKING_DIRECTORY/casper-dashboad/common
npm install

cd YOUR_WORKING_DIRECTORY/casper-dashboad/event-handler
npm install

```

### Usage

```sh
npm start

```
