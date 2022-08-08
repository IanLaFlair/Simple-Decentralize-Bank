 
const NewbieToken = artifacts.require('NewbieToken')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

require ('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner, customer]) => {
    let newt, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }
    

    before(async () =>{
        newt = await NewbieToken.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, newt.address)

        // Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('100000'))

        // Transfer 100 mock Tethers to Customer
        await newt.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Newbie Token', async () => {
        it('matches name successfully', async () => {
            const name = await newt.name()
            assert.equal(name,'Newbie Token')
        })
    })

    describe('Newbie Gift Token', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name,'Newbie Gift Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name,'Furio Bank')
        })

        it('contract has tokens', async () =>{
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('100000'))
        })
        describe('Yield Farming', async() => {
            it('rewards tokens for staking', async() => {
                let result
    
                //check invnestor balance
                result = await newt.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'Customer newb wallet balance before staking')
                 
                //check staking for customer
                await newt.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), {from: customer})

                // //check updated balance of customer
                result = await newt.balanceOf(customer)
                assert.equal(result.toString(), tokens('0'), 'Customer newb wallet balance after staking')

                // //check update balance of decentral bank
                result = await newt.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('100'), 'decentral bank newb wallet balance before staking')
                
                // //is staking balance
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'true', 'customer is staked')

                //issue tokens
                result = await decentralBank.issueTokens({from: owner})

                //ensure only the owner 
                result = await decentralBank.issueTokens({from: customer}).should.be.rejected;
             
                //unstake token
                await decentralBank.unstakeTokens({from: customer})

                
                result = await newt.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')     
                
                // Check Updated Balance of Decentral Bank
                result = await newt.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after staking from customer')     
                
                // Is Staking Update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'customer is no longer staking after unstaking')
                

            })
        })
    })
})