import React, {Component} from 'react'
import Web3 from 'web3'
import Navbar from './Navbar.js'
import NewbieToken from '../truffle_abis/NewbieToken.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticleSettings from './ParticleSettings'

class App extends Component {

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            window.alert('You dont have metamask')
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId()
        
        const newbData = NewbieToken.networks[networkId]
        if(newbData){
            const newb = new web3.eth.Contract(NewbieToken.abi, newbData.address)
            this.setState({newb})
            let newbBalance = await newb.methods.balanceOf(this.state.account).call()
            this.setState({newbBalance: newbBalance.toString()})
            console.log({balance: newb._address})
        }else {
            window.alert('Error! NewbContract not deployed')
        }
        const rwdData = RWD.networks[networkId]
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            let rewardBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rewardBalance.toString()})
            console.log({rewardBalances: rewardBalance})
        }
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData){
            const decBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank: decBank})
            console.log({DECENTRALBANKADDRESS : decBank._address})
            let stakingBalance = await decBank.methods.stakingBalance(this.state.account).call()
            console.log({stakingbalance: stakingBalance})
            this.setState({stakingBalance: stakingBalance.toString()})
        }else {
            window.alert('Error! DecentralBank not deployed')
        }

        this.setState({loading: false})

    }


    stakeTokens = (amount) => {
        this.setState({loading: true })
        this.state.newb.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
          this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
          })
        }) 
      }

    unstakeTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        })
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            newb: {},
            rwd: {},
            decentralBank: {},
            newbBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render(){
        let content
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>LOADING PLEASE</p> 
        : content = <Main
        newbBalance={this.state.newbBalance}
        rwdBalance={this.state.rwdBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticleSettings />
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                               {content}
                            </div>
                        </main>
                        </div>
                </div>
            </div>

        )        
    }
}

export default App;