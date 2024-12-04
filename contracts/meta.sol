// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GamblingContract {
    address public owner;

    // Mapping to track user deposits (user => deposit balance)
    mapping(address => uint256) public deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event OwnerWithdrew(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit POL (native token) into the contract
    function depositPOL() external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // Update the user's deposit balance
        deposits[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

       // Get the user's deposited balance
    function getUserBalance() external view returns (uint256) {
        return deposits[msg.sender];
    }

    // Withdraw POL (native token) by the user
    function withdrawPOL(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient balance");

        // Deduct the amount from the user's deposit
        deposits[msg.sender] -= amount;

        // Transfer the POL to the user
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    // Owner withdraws POL (native token) from the contract
    function ownerWithdrawPOL(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance in contract");
        payable(owner).transfer(amount);
        emit OwnerWithdrew(amount);
    }

    // Check the contract's POL balance
    function contractPOLBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get the current owner's address
    function getOwner() external view returns (address) {
        return owner;
    }

    // Change the owner to a new address
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // Fallback function to accept POL directly
    receive() external payable {
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}