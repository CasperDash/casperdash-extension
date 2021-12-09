# Welcome to Casper Dash 👋

[![codecov](https://codecov.io/gh/CasperDash/casperdash-client/branch/develop/graph/badge.svg?token=3KWLVN3DPV)](https://codecov.io/gh/CasperDash/casperdash-client)

![](https://i.imgur.com/N0DGupc.png)

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

### Web Server

https://github.com/CasperDash/casperdash-api

Web server is implemented in [Express.js](https://expressjs.com/). It allows us to create read-only data pipeline for clients.

### Client

React web app provides user a simple and convenient dashboard to explore the blocks and manipulate the wallets.

<!-- GETTING STARTED -->

## Development

### Prerequisites

-   yarn >= 1.22.5
-   nodejs >= 12

# Client

### Install

```sh
cd YOUR_WORKING_DIRECTORY/casperdash-client/client
yarn install
```

### Usage

#### Configuration

The configuration can be configurated at

```
YOUR_WORKING_DIRECTORY/casperdash-client/client/src/config/index.js
```

or by editing .env.\*.local

```
REACT_APP_API_ROOT=https://localhost:3001  //api endpoint
REACT_APP_NETWORK_NAME=casper-test // casper network
REACT_APP_AUCTION_HASH=93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2  // contract hash for delegation
REACT_APP_AVAILABLE_FEATURES=["home","dashboard","history","nfts","tokens","keyManager","stacking"] //Features can be enabled/disabled
```

```shell
yarn start // start web with dev config
yarn build // publish
yarn test  // run unit test
yarn build-style // build css
```
