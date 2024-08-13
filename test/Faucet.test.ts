import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Faucet", function () {
  it("Faucet should work as expected", async function () {
    const [owner, user1, user2] = await ethers.getSigners();

    const ERC20Deployer = await ethers.getContractFactory("StakedBTC");
    const FaucetDeployer = await ethers.getContractFactory("BimaFaucet");

    const stBTC1 = await ERC20Deployer.deploy();
    const stBTC2 = await ERC20Deployer.deploy();

    const stBTC1Address = await stBTC1.getAddress();
    const stBTC2Address = await stBTC2.getAddress();

    const faucet = await FaucetDeployer.deploy();
    const faucetAddress = await faucet.getAddress();

    await stBTC1.transfer(faucetAddress, parseEther("1000"));
    await stBTC2.transfer(faucetAddress, parseEther("2000"));

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("1000"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("2000"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("0"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("0"));

    await faucet.connect(user1).getTokens(stBTC1Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("998"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("2000"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("2"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("0"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("0"));

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;

    await faucet.connect(user1).getTokens(stBTC2Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("998"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1998"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("2"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("2"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("0"));

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user1).getTokens(stBTC2Address)).to.be.reverted;

    await time.increase(86390);

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user1).getTokens(stBTC2Address)).to.be.reverted;

    await faucet.connect(user2).getTokens(stBTC2Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("998"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1996"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("2"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("2"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("2"));

    await time.increase(120);

    await faucet.connect(user1).getTokens(stBTC1Address);
    await faucet.connect(user1).getTokens(stBTC2Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("996"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1994"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("4"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("4"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("0"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("2"));

    await expect(faucet.connect(user2).getTokens(stBTC2Address)).to.be.reverted;

    await faucet.connect(user2).getTokens(stBTC1Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("994"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1994"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("4"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("4"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("2"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("2"));

    await expect(faucet.connect(user2).getTokens(stBTC1Address)).to.be.reverted;

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user1).getTokens(stBTC2Address)).to.be.reverted;

    await time.increase(86400);

    await faucet.connect(user1).getTokens(stBTC1Address);
    await faucet.connect(user1).getTokens(stBTC2Address);
    await faucet.connect(user2).getTokens(stBTC1Address);
    await faucet.connect(user2).getTokens(stBTC2Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("990"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1990"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("6"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("6"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("4"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("4"));

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user1).getTokens(stBTC2Address)).to.be.reverted;
    await expect(faucet.connect(user2).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user2).getTokens(stBTC2Address)).to.be.reverted;

    await time.increase(86300);

    await expect(faucet.connect(user1).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user1).getTokens(stBTC2Address)).to.be.reverted;
    await expect(faucet.connect(user2).getTokens(stBTC1Address)).to.be.reverted;
    await expect(faucet.connect(user2).getTokens(stBTC2Address)).to.be.reverted;

    await time.increase(200);

    await faucet.connect(user1).getTokens(stBTC1Address);
    await faucet.connect(user1).getTokens(stBTC2Address);
    await faucet.connect(user2).getTokens(stBTC1Address);
    await faucet.connect(user2).getTokens(stBTC2Address);

    expect(await stBTC1.balanceOf(faucetAddress)).to.equal(parseEther("986"));
    expect(await stBTC2.balanceOf(faucetAddress)).to.equal(parseEther("1986"));

    expect(await stBTC1.balanceOf(user1.address)).to.equal(parseEther("8"));
    expect(await stBTC2.balanceOf(user1.address)).to.equal(parseEther("8"));

    expect(await stBTC1.balanceOf(user2.address)).to.equal(parseEther("6"));
    expect(await stBTC2.balanceOf(user2.address)).to.equal(parseEther("6"));
  });
});
