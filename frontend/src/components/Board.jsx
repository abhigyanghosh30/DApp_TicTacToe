import React,{Component} from 'react';
import Web3 from 'web3';
import './Board.css';

class Board extends Component {
    constructor(){
        super();
        this.state = {board:[' ',' ',' ',' ',' ',' ',' ',' ',' ']};
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadContractBoard = this.loadContractBoard.bind(this);
        
        const web3 = new Web3("ws://10.2.135.44:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        console.log(contract.events.boardUpdated);
        contract.events.boardUpdated(function(error, event){ console.log(event); })
        .on('data', function(event){
            let x = parseInt(event.returnValues['x']);
            let y = parseInt(event.returnValues['y']);
            contract.methods.tostring(x,y).call()
            .then((res)=>{
                document.getElementById(x*3+y).innerHTML = res; 
            });

        });
    }

    loadContractBoard(){
        var state = this.state;
        const web3 = new Web3("ws://10.2.135.44:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                contract.methods.tostring(i,j).call()
                .then((res)=>{
                    document.getElementById(i*3+j).innerHTML = res;
                });
            }
        } 
        this.setState(state);
        console.log(this.state);;
    }

    handleSubmit(event){
        event.preventDefault();
        const web3 = new Web3("ws://10.2.135.44:8545");
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
        if(this.props.appstate.address){
            this.loadContractBoard();
        }
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td onClick={this.handleSubmit} id="0">{this.state.board[0]}</td>
                        <td onClick={this.handleSubmit} className="vert" id="1">{this.state.board[1]}</td>
                        <td onClick={this.handleSubmit} id="2">{this.state.board[2]}</td>
                    </tr>
                    <tr>
                        <td onClick={this.handleSubmit} className="hori" id="3">{this.state.board[3]}</td>
                        <td onClick={this.handleSubmit} className="vert hori" id="4">{this.state.board[4]}</td>
                        <td onClick={this.handleSubmit} className="hori" id="5">{this.state.board[5]}</td>
                    </tr>
                    <tr>
                        <td onClick={this.handleSubmit} id="6">{this.state.board[6]}</td>
                        <td onClick={this.handleSubmit} id="7" className="vert">{this.state.board[7]}</td>
                        <td onClick={this.handleSubmit} id="8">{this.state.board[8]}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
export default Board;