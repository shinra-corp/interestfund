---
description: Description of Fund Smart Contract
---

# Fund



Fund Smart Contract is the Project Wallet that receives DAI from Donors and lend to Compound.  
This smart contract is responsible to manage the user fund such that Project members can´t spend money that don´t belong to them.

A new Fund is instantiated following a Factory Pattern.

With a new Fund is also created a sub domain for that fund, so donors can transfer DAI more easily to the Fund address.

The Fund contract can only manage DAI Token. Ever thing else send to this contract will be effectively lost.

### Events

```text
event StartFunding(address indexed donor, uint256 amount);
```

When a new Donor start funding a project this event is emitted to the network.

#### Parameters 

* donor - Address that transfer DAI token to Fund
* amount - Amount in DAI \(18 decimals\) transfer to Fund

```text
event Withdraw(address indexed donor, uint256 amount);
```

When Donor withdraw part or total balance of Fund.

* donor - Address that transfer DAI token to Fund
* amount - Amount in DAI \(18 decimals\) transfer to Fund

```text
 event TopFunding(address indexed donor, uint256 amount);
```

When a already donor top funding with more DAI tokens. 

* donor - Address that transfer DAI token to Fund
* amount - Amount in DAI \(18 decimals\) transfer to Fund

