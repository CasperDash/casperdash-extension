# Welcome to Casper Dash 👋

> A non-custodial wallet for Casper blockchain

[![codecov](https://codecov.io/gh/CasperDash/casperdash-client/branch/develop/graph/badge.svg?token=3KWLVN3DPV)](https://codecov.io/gh/CasperDash/casperdash-client)

![](https://i.imgur.com/N0DGupc.png)

### 🏠 [casperdash.io ](casperdash.io) ( beta )

### <i class="fa fa-book fa-fw"></i> Document https://hackmd.io/@casperdash/r1wtIVYVt

## Features/Road map

-   [x] Integrate with Casper Singer
-   [x] Dashboard
    -   [x] View CSPR balance
    -   [x] Send/Receive CSPR
    -   [x] CSPR price chart
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
-   [x] Staking
    -   [x] Staking CSPR
-   [ ] Account management
    -   [ ] Create/update/manage public/private keys
    -   [ ] Import/backup account from private key file or mnemonic words
    -   [ ] Provide method to sign contract from external site
-   [x] Web extension wallet

#### Will be on separated repository

-   [ ] IOS app
-   [ ] Android app

## Development

### Prerequisites

-   yarn >= 1.22.5
-   nodejs = 14

## Architecture

### Web Server

https://github.com/CasperDash/casperdash-api

Web server is implemented in [Express.js](https://expressjs.com/). It allows us to create read-only data pipeline for clients.

### Client

[React.js](https://reactjs.org/) + [Flux structure](https://www.javatpoint.com/react-flux-concept#:~:text=Flux%20is%20an%20application%20architecture,a%20library%20nor%20a%20framework.&text=It%20is%20a%20kind%20of,of%20Unidirectional%20Data%20Flow%20model.)

React web app provides user a simple and convenient dashboard to explore the blocks and manipulate the wallets.

There are 2 parts, web and browser extension which are sharing similar logic and dataflow. The main different is user interfaces.

[Webpack](https://webpack.js.org/) is using for building each platform.

#### I. Web

##### 1. Install

```sh
cd YOUR_WORKING_DIRECTORY/casperdash-client/client
yarn install
```

##### 2. UI components

The main UI components of web are placed under

```
YOUR_WORKING_DIRECTORY/casperdash-client/client/src/components/web
```

##### 3. Configurations

The configuration can be configurated by editing .env.\*.local

```
REACT_APP_API_ROOT=https://localhost:3001  //api endpoint
REACT_APP_NETWORK_NAME=casper-test // casper network
REACT_APP_AUCTION_HASH=93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2  // contract hash for delegation
REACT_APP_AVAILABLE_FEATURES=["home","dashboard","history","nfts","tokens","keyManager","staking"] //Features can be enabled/disabled
```

##### 4. Usage

```shell
yarn dev             // start web with dev config
yarn start-mainnet  // start web with testnet config
yarn start-testnet // start web with mainnet config
yarn test         // run test with coverage
```

#### II. Browser Extension

##### 1. Install

```sh
cd YOUR_WORKING_DIRECTORY/casperdash-client/client
yarn install
```

##### 2. UI components

The main UI components of web-extension are placed under

```
YOUR_WORKING_DIRECTORY/casperdash-client/client/src/components/web-extension
```

##### 3. Configurations

The configuration can be configurated by editing .env.\*.local

```
REACT_APP_API_ROOT=https://localhost:3001  //api endpoint
REACT_APP_NETWORK_NAME=casper-test // casper network
REACT_APP_AUCTION_HASH=93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2  // contract hash for delegation
```

##### 4. Usage

```shell
yarn dev-extension              // watch extension with dev config
yarn dev-extension-mainnet      // watch extension with mainet config
yarn dev-extension-testnet      // watch extension with testnet config
```

##### 5. Load into Chrome

To load the built files into Chrome, open

![](https://i.imgur.com/kxZk0EW.png)

Enable "Developer mode" if it's not enabled yet:

![](https://i.imgur.com/zdPemcj.png)

Click on "Load unpacked":

![](https://i.imgur.com/HRDH6p8.png)

Find the `YOUR_WORKING_DIRECTORY/casperdash-client/build_extension/` directory on your system and open it.

The extension should be now at the top of the page:

## Workflow and contributions

https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

### License

[MIT](https://raw.githubusercontent.com/CasperDash/casperdash-api/master/LICENSE)
