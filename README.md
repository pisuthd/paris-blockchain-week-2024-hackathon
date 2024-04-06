# USD Silver Surfer
Our protocol allows users to gain exposure to Real-World Assets (RWAs) powered by Solana blockchain. The first token we introduced is USD Silver Surfer, a yield-bearing token backed by physical silver holdings, offering returns pegged to the US dollar. 

This token is built on Solana's Token Program framework and utilizes several extensions for added functionality, including:
- Metadata Pointer - This enables SPL tokens to be associated with on-chain metadata.
- Yield-Bearing - Allows the token's value to automatically increase or decrease based on the silver price relative to the USD.
- Transfer Fees - Allows for automatic fee deduction, which will contribute to an assurance pool.



## Getting started

We have 2 folders, the first `spl-common-scripts` collects all necessary scripts to made up a different type of tokens, while `usd-silver-surfer` is for usd stablecoin with the yield from silver.

```
cd packages/usd-silver-surfer
```

We can then run all tests by:

```
npm install
npm run test
```

## Deployment

Devnet

https://explorer.solana.com/address/581cZHJk44ysyMreY99aB3qZxHybw3sKaxaFGW67NdvR?cluster=devnet

https://explorer.solana.com/tx/bZKKZUcvZ3hJWYwQe5pWzxqXzSAtxm3eLwvqeP9CAdqJW3f5BZxPGJHyS5kNKzhG6y78GFcVWWfFDxiH2cJ5Yg8?cluster=devnet
