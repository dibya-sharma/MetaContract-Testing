// const {time, loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gambling contract", function(){
    let GamblingContract;
    let gamblingContract;
    let owner;
    let user1;
    let user2;

beforeEach(async function(){
    [owner,user1,user2] = await ethers.getSigners();
     //console.log(`Accounts Retrieved: ${owner.address}${user1.address}${user2.address}`)
     console.log("Accounts retrieved:", {
        owner: owner.address,
        user1: user1.address,
        user2: user2.address,
      }); 
      
      // Deploy the contract
    GamblingContract = await ethers.getContractFactory("GamblingContract");
    gamblingContract = await GamblingContract.deploy();
    console.log("Contract deployed at:", gamblingContract.address);
    })
    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
          const contractOwner = await gamblingContract.getOwner();
          console.log("Contract owner:", contractOwner);
          expect(contractOwner).to.equal(owner.address);
        });
      });
})


//actual full code 
// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("GamblingContract", function () {
//   let GamblingContract;
//   let gamblingContract;
//   let owner;
//   let user1;
//   let user2;

//   // Deploy the contract before each test
//   beforeEach(async function () {
//     // Get signers (accounts)
//     [owner, user1, user2] = await ethers.getSigners();
//     console.log("Accounts retrieved:", {
//       owner: owner.address,
//       user1: user1.address,
//       user2: user2.address,
//     });

//     // Deploy the contract
//     GamblingContract = await ethers.getContractFactory("GamblingContract");
//     gamblingContract = await GamblingContract.deploy();
//     console.log("Contract deployed at:", gamblingContract.address);
//   });

//   // Test Contract Deployment
//   describe("Deployment", function () {
//     it("Should set the correct owner", async function () {
//       const contractOwner = await gamblingContract.getOwner();
//       console.log("Contract owner:", contractOwner);
//       expect(contractOwner).to.equal(owner.address);
//     });
//   });

//   // Test Deposit Functionality
//   describe("Deposit", function () {
//     it("Should allow users to deposit POL", async function () {
//       const depositAmount = ethers.parseEther("1.0"); // 1 ETH
//       console.log("Deposit amount:", depositAmount.toString());

//       // Deposit from user1
//       await gamblingContract.connect(user1).depositPOL({ value: depositAmount });
//       console.log("User1 deposited successfully.");

//       // Check user's balance
//       const userBalance = await gamblingContract.connect(user1).getUserBalance();
//       console.log("User1 balance after deposit:", userBalance.toString());
//       expect(userBalance).to.equal(depositAmount);
//     });

//     it("Should revert deposit of zero amount", async function () {
//       console.log("Testing zero deposit.");
//       await expect(
//         gamblingContract.connect(user1).depositPOL({ value: 0 })
//       ).to.be.revertedWith("Amount must be greater than 0");
//       console.log("Zero deposit reverted as expected.");
//     });
//   });

//   // Test Withdrawal Functionality
//   describe("Withdrawal", function () {
//     it("Should allow users to withdraw their deposited POL", async function () {
//       const depositAmount = ethers.parseEther("2.0");
//       console.log("Deposit amount for withdrawal test:", depositAmount.toString());

//       // Deposit first
//       await gamblingContract.connect(user1).depositPOL({ value: depositAmount });
//       console.log("User1 deposited for withdrawal test.");

//       // Track initial balance
//       const initialBalance = await ethers.provider.getBalance(user1.address);
//       console.log("User1 initial balance:", initialBalance.toString());

//       // Withdraw
//       const withdrawAmount = ethers.parseEther("1.0");
//       console.log("Withdraw amount:", withdrawAmount.toString());
//       const tx = await gamblingContract.connect(user1).withdrawPOL(withdrawAmount);
//       const receipt = await tx.wait();

//       // Calculate gas cost
//       const gasUsed = receipt.gasUsed;
//       const gasPrice = receipt.gasPrice;
//       const gasCost = gasUsed * gasPrice;
//       console.log("Gas used:", gasUsed.toString(), "Gas price:", gasPrice.toString(), "Gas cost:", gasCost.toString());

//       // Check new balance
//       const newBalance = await ethers.provider.getBalance(user1.address);
//       console.log("User1 new balance:", newBalance.toString());
//       expect(newBalance).to.be.closeTo(
//         initialBalance + withdrawAmount - gasCost, 
//         ethers.parseEther("0.01")
//       );
//     });

//     it("Should prevent withdrawal exceeding deposit", async function () {
//       const depositAmount = ethers.parseEther("1.0");
//       await gamblingContract.connect(user1).depositPOL({ value: depositAmount });
//       console.log("User1 deposited for excess withdrawal test.");

//       await expect(
//         gamblingContract.connect(user1).withdrawPOL(ethers.parseEther("2.0"))
//       ).to.be.revertedWith("Insufficient balance");
//       console.log("Excess withdrawal reverted as expected.");
//     });
//   });

//   // Test Owner Functionality
//   describe("Owner Actions", function () {
//     it("Should allow owner to withdraw contract funds", async function () {
//       const depositAmount = ethers.parseEther("5.0");
//       console.log("Owner withdrawal test deposit amount:", depositAmount.toString());

//       // Multiple users deposit
//       await gamblingContract.connect(user1).depositPOL({ value: depositAmount });
//       await gamblingContract.connect(user2).depositPOL({ value: depositAmount });
//       console.log("User1 and User2 deposited for owner withdrawal test.");

//       const withdrawAmount = ethers.parseEther("3.0");
//       const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
//       console.log("Initial owner balance:", initialOwnerBalance.toString());

//       const tx = await gamblingContract.connect(owner).ownerWithdrawPOL(withdrawAmount);
//       const receipt = await tx.wait();

//       // Calculate gas cost
//       const gasUsed = receipt.gasUsed;
//       const gasPrice = receipt.gasPrice;
//       const gasCost = gasUsed * gasPrice;
//       console.log("Gas used:", gasUsed.toString(), "Gas price:", gasPrice.toString(), "Gas cost:", gasCost.toString());

//       const newOwnerBalance = await ethers.provider.getBalance(owner.address);
//       console.log("New owner balance:", newOwnerBalance.toString());

//       expect(newOwnerBalance).to.be.closeTo(
//         initialOwnerBalance + withdrawAmount - gasCost, 
//         ethers.parseEther("0.01")
//       );
//     });

//     it("Should prevent non-owners from withdrawing", async function () {
//       console.log("Testing non-owner withdrawal attempt.");
//       await expect(
//         gamblingContract.connect(user1).ownerWithdrawPOL(ethers.parseEther("1.0"))
//       ).to.be.revertedWith("Only the owner can call this function");
//       console.log("Non-owner withdrawal attempt reverted as expected.");
//     });
//   });

//   // Test Ownership Transfer
//   describe("Ownership Transfer", function () {
//     it("Should allow owner to transfer ownership", async function () {
//       console.log("Testing ownership transfer to User1.");
//       await gamblingContract.connect(owner).changeOwner(user1.address);
//       console.log("Ownership transferred to:", user1.address);
//       expect(await gamblingContract.getOwner()).to.equal(user1.address);
//     });

//     it("Should prevent transferring to zero address", async function () {
//       console.log("Testing ownership transfer to zero address.");
//       await expect(
//         gamblingContract.connect(owner).changeOwner(ethers.ZeroAddress)
//       ).to.be.revertedWith("New owner cannot be the zero address");
//       console.log("Ownership transfer to zero address reverted as expected.");
//     });
//   });
// });
