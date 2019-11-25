import React,{Component} from 'react';
import Web3 from 'web3';
import './Board.css';

class Board extends Component {
    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        const web3 = new Web3("ws://localhost:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        console.log(contract.events.boardUpdated);
        contract.events.boardUpdated(function(error, event){ console.log(event); })
        .on("connected", function(subscriptionId){
            console.log(subscriptionId);
        })
        .on('data', function(event){
            console.log(event); // same results as the optional callback above
        });
    }

    handleSubmit(event){
        event.preventDefault();
        const web3 = new Web3("ws://localhost:8545");
        console.log(event.target.id);
        let account = sessionStorage.getItem('account');
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.printPlayers().call({from: account})
        .then((res)=>{
            console.log(res);
        });
        contract.methods.Move(Math.floor(event.target.id/3),event.target.id%3).send({from: sessionStorage.getItem('account')})
        .then(()=>{
            contract.methods.tostring(0,0).call({from: sessionStorage.getItem('account')})
            .then((res)=>{
                console.log(res);
            })
        });
    }
    componentDidMount(){
        console.log(this.props.appstate);
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td onClick={this.handleSubmit} id="0"></td>
                        <td onClick={this.handleSubmit} className="vert" id="1"></td>
                        <td onClick={this.handleSubmit} id="2"></td>
                    </tr>
                    <tr>
                        <td onClick={this.handleSubmit} className="hori" id="3"></td>
                        <td onClick={this.handleSubmit} className="vert hori" id="4"></td>
                        <td onClick={this.handleSubmit} className="hori" id="5"></td>
                    </tr>
                    <tr>
                        <td onClick={this.handleSubmit} id="6"></td>
                        <td onClick={this.handleSubmit} id="7" className="vert"></td>
                        <td onClick={this.handleSubmit} id="8"></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
export default Board;