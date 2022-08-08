pragma solidity ^0.8.4;
import './RWD.sol';
import './NewbieToken.sol';

contract DecentralBank{
    string public name = 'Furio Bank';
    address public owner;
    NewbieToken public newb;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, NewbieToken _newb) public{
        rwd = _rwd;
        newb = _newb;
        owner = msg.sender;
    }

   function depositTokens(uint _amount) public {

  // require staking amount to be greater than zero
    require(_amount > 0, 'amount cannot be 0');
  
  // Transfer tether tokens to this contract address for staking
  newb.transferFrom(msg.sender, address(this), _amount);

  // Update Staking Balance
  stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

  if(!hasStaked[msg.sender]) {
    stakers.push(msg.sender);
  }

  // Update Staking Balance
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
}

function issueTokens() public{
    require(msg.sender == owner, 'caller mustbe the owner');
    for(uint i=0; i < stakers.length; i++){
        address recipient = stakers[i];
        uint balance = stakingBalance[recipient];
        if(balance > 0){
            rwd.transfer(recipient, balance);
        }
    }
}

function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'staking balance cant be less on zero');

    //transfer back
    newb.transfer(msg.sender, balance);

    stakingBalance[msg.sender] = 0;

    isStaking[msg.sender] = false;

}
    
}