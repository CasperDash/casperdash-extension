# Welcome to Casper Dash 👋

> A non-custodial wallet for Casper blockchain

[![codecov](https://codecov.io/gh/CasperDash/casperdash-client/branch/develop/graph/badge.svg?token=3KWLVN3DPV)](https://codecov.io/gh/CasperDash/casperdash-client)

<img width="354" alt="image" src="https://user-images.githubusercontent.com/6711653/163332067-359844e1-c468-4be9-917e-c86b4b2403a9.png">



### 🏠 [casperdash.io](https://www.casperdash.io)


## Features

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
-   [x] Staking
    -   [x] Staking CSPR
-   [x] Account management
    -   [x] Create/update/manage public/private keys
    -   [x] Import/backup account from private key file or mnemonic words
    -   [x] Provide method to sign contract from external site

#### Will be on separated repository

-   [x] IOS app ( https://github.com/CasperDash/casperdash-mobile-wallet )
-   [x] Android app ( https://github.com/CasperDash/casperdash-mobile-wallet )

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


#### Browser Extension

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
yarn dev-extension-mainnet // start browser extension with dev config
yarn build-extension-mainnet  // build browser with production config
yarn test         // run test with coverage
```

##### 5. Load into Chrome

-   To load the built files into Chrome, open

![](https://i.imgur.com/kxZk0EW.png)

-   Enable "Developer mode" if it's not enabled yet:

![](https://i.imgur.com/zdPemcj.png)

-   Click on "Load unpacked":

![](https://i.imgur.com/HRDH6p8.png)

-   Find the `YOUR_WORKING_DIRECTORY/casperdash-client/build_extension/` directory on your system and open it.

-   The extension should be now at the top of the page:

## Workflow and contributions

https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

### License

[MIT](https://raw.githubusercontent.com/CasperDash/casperdash-api/master/LICENSE)
