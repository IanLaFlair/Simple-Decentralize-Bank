import React, {Component} from 'react'
import Web3 from 'web3';
import tether from '../tether.png'

class Main extends Component {

    render(){
        console.log(this.props.newbBalance)
        return (
           <div id='content' className='mt-3'>
                <table className='table text-muted text-center'>
                    <thead>
                        <tr style={{color:'white'}}>
                            <th scope='col'>Staking Balance</th>
                            <th scope='col'>Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'white'}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')}USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')}RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-2 p-3' style={{opacity: '.9'}}>
                    <form className='mb-3' 
                    onSubmit={(event) => {
                        event.preventDefault()
                        let amount 
                        amount = this.input.value.toString()
                        amount = window.web3.utils.toWei(amount, 'Ether')
                        this.props.stakeTokens(amount)
                    }}>
                        <div style={{borderSpace:'0 lem'}}>
                            <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
                            <span className='float-right' style={{marginRight:'8px'}}>
                                Balance: {window.web3.utils.fromWei(this.props.newbBalance, 'Ether')}
                            </span>
                        <div className='input-group mb-4 ml-1'>
                            <input type='text'
                            placeholder='0'
                            required
                            ref={(input)=>{this.input = input}}/>
                            <div className='input-group-open'>
                            <div className='input-group-text'>
                                <img src={tether} height='32'/>&nbsp; NewbieToken
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                        </div>
                    </form>
                    <button
                    type='submit' 
                    onClick={(event) => {
                        event.preventDefault(
                         this.props.unstakeTokens()
                        )
                    }}
                    className='btn btn-primary btn-lg btn-block'>WITHDRAW</button>
                    <div className='card-body text-center' style={{color: 'blue'}}>
                        AIRDROP
                    </div>
                </div>
                
           </div>
        )        
    }
}

export default Main;