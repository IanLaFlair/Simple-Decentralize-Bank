const NewbieToken = artifacts.require('NewbieToken')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(NewbieToken)
    const newb =  await NewbieToken.deployed()

    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    await deployer.deploy(DecentralBank, rwd.address, newb.address)
    const decentralBank = await DecentralBank.deployed()

    await rwd.transfer(decentralBank.address, '1000000000000000000000')

    await newb.transfer(accounts[1], '100000000000000000000')
    
    
}