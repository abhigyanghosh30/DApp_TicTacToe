import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Board from './Board';

class App extends Component {
  componentDidMount(){
    console.log(Web3.givenProvider);
    var state = {account: '', abi:'', contract:'', }
    if(sessionStorage.getItem('account')){
      state['account'] = sessionStorage.getItem('account');
    }
    else if(Web3.givenProvider){
      const web3 = new Web3(Web3.givenProvider);
      web3.eth.getAccounts().then((accounts)=>{
        sessionStorage.setItem('account',accounts[0]);
        this.setState({account:accounts[0]});  
      });
    }
    if(sessionStorage.getItem('address')){
      state['address'] = sessionStorage.getItem('address');
    }
    this.setState(state);
  }

  async getNewContract(event) {
    event.preventDefault();
    fetch("http://127.0.0.1:8000/ttt/"+sessionStorage.getItem('account'),{
      method:"GET",
      headers: {
        "Access-Control-Allow-Origin":"*"
      },
    })
    .then(res=>res.json())
    .then((res)=>{
      console.log(res);
      sessionStorage.setItem('address',res["address"]);
      sessionStorage.setItem('abi',JSON.stringify(res["abi"]));
      var state = this.state;
      state['address'] = res["address"];
      this.setState(state);
      this.startGame();
    });
  }

  async startGame(){
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    let abi = JSON.parse(sessionStorage.getItem('abi'));
    let address = sessionStorage.getItem('address');
    let contract = new web3.eth.Contract(abi,address);
    contract.methods.joinGame().send({from:sessionStorage.getItem('account'),value:web3.utils.toWei("4","ether"),gas:3000000});
    // contract.methods.startNewGame().send();
  }

  async getAccount(){
    const web3 = new Web3("ws://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts()
    const accountnumber = Math.floor(Math.random()*9+1);
    sessionStorage.setItem('account',accounts[accountnumber]);
    var state = this.state;
    state["account"] = accounts[accountnumber];
    this.setState(state);
  }

  constructor(props) {
    super(props)
    this.state = { account: '' }
    this.getAccount = this.getAccount.bind(this);
    this.getNewContract = this.getNewContract.bind(this);

  }

  render() {
    if (this.state.account && this.state.address){
      return (
        <div className="container">
          <h1>Hello, World!</h1>
          <p>Your account: {this.state.account}</p>
        </div>,
        <Board appstate={this.state}/>
      );
    }
    else if(!this.state.account){
      return (
        <button className="btn btn-success" onClick={this.getAccount}>Get a dummy account</button>
      );
    }
    else if(!this.state.address){
      return (
        <button className="btn btn-primary" onClick={this.getNewContract}>Get contract</button>
      );
    }
    
  }
}

export default App;
