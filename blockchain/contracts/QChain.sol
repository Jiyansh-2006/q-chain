// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract QChain {
    address public owner;

    struct Transaction {
        address sender;
        address receiver;
        uint amount;
        string note;
    }

    Transaction[] public transactions;

    event NewTransaction(address indexed sender, address indexed receiver, uint amount, string note);

    constructor() {
        owner = msg.sender;
    }

    function sendTransaction(address _receiver, uint _amount, string memory _note) public {
        transactions.push(Transaction(msg.sender, _receiver, _amount, _note));
        emit NewTransaction(msg.sender, _receiver, _amount, _note);
    }

    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}
