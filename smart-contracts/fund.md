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

### Functions

```text
function funding(uint256 _amount) public nonReentrant
```

Start funding a project.

* \_amount - Amount of DAI Tokens approved to fund.

```text
function withdraw(uint256 _amount) public nonReentrant
```

Withdraw your DAI from project.

* \_amount - Amount of DAI Tokens to withdraw from fund.

```text
function withdrawInterest(uint256 _amount) public onlyManager nonReentrant
```

Withdraw generated interest from project. This function call only be call by the Fund manager.

* \_amount - Amount of DAI Tokens to withdraw from interest fund.

```text
function accruedInterest() public view returns(uint256)
```

Return the amount of interests generated from donations.

```text
function balanceOf(address _donor) public view returns(uint256)
```

Return the balance of a given address. This balance don't change as DAI accrued interest.

* \_donor - Address of donor that will return balance.

```text
function () external payable
```

Default Function that will always revert.

