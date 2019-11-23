import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Board from './Board';

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData()
  }
  
  async loadBlockchainData() {
    const web3 = new Web3("http://10.42.0.149:8545");
    const accounts = await web3.eth.getAccounts()
    const accountnumber = Math.floor(Math.random()*10);
    fetch("http://10.42.0.149:8000/ttt/"+accounts[accountnumber],{
      method:"GET",
      headers: {
        "Access-Control-Allow-Origin":"*"
      },
    })
    .then(res=>res.json())
    .then((res)=>{
      console.log(res);
      const contract = new web3.eth.Contract(res["abi"],res["address"]);
      this.setState({ account: accounts[accountnumber], abi:res["abi"],address:res["address"],contract:contract});
      contract.methods.joinGame().send({from:accounts[accountnumber],value:web3.utils.toWei("4","ether")})
    });
    console.log(accounts);
  }

  constructor(props) {
    super(props)
    this.state = { account: '' }
  }

  changeState(key,value){
    this.state[key]=value;
  }


  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
      </div>,
      <Board appstate={this.state} changeappstate={this.changeState.bind(this)}/>
    );
  }
}

export default App;
