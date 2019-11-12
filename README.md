# Interest Fund

Fund a Project with DAI Compound Interest. You don't give away your money only the interest of that deposit. You can think that you are giving your time. A donor can start funding one project then change to another project at any time.

You can start your week giving your interest to help some project you use, than withdraw and start funding a human rights project and by the weekend you give to DLX Meetup so we can create more fun examples.

## Risk

Transfer and keeping money in a smart contract have always some level of risk. When you start funding one project, the transfered DAI is added to DAI Market \(Compound\) and starts earning interest. There is two majors risk you should think, first is an error in this smart contract, second some problems with the Compound Protocol.

If you like to know more about Open Finance: [Bankless](https://bankless.substack.com/)

If you like to know more about Open Finance and blockchain in general : [Meetup DLX](https://www.meetup.com/dLX-a-sardinha-descentralizada/)

To see more about the risks of Money Lego Protocols \(aka DeFi\) : [DeFi Score](https://defiscore.io/)

## Developments

The basic contract is created with some test.

To do - General:

Create more tests.

Find a way to reclaim unused subdomains. Ideal should not need a admin function.

Create a tutorial showing how to use the smart contract functions.

Create a tutorial smart contract to deposit and withdraw based on given interest / time.

## How to help

This project uses Truffle Framework and Ganache-cli

Install Truffle

```text
npm install -g truffle
```

Install Ganache-cli

```text
npm install -g ganache-cli
```

Clone this project

```text
git clone https://github.com/ngmachado/interestfund.git
cd interestfund
```

Running Tests

In one terminal start ganache-cli

```text
ganache-cli
```

```text
cd interestfund

truffle test
```

### Learn more

{% embed url="https://shinra-corporation.gitbook.io/interest-fund/" %}



