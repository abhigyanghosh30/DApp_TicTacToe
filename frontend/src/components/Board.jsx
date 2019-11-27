import React,{Component} from 'react';
import Web3 from 'web3';
import './Board.css';

class Board extends Component {
    constructor(){
        super();
        this.state = {board:[' ',' ',' ',' ',' ',' ',' ',' ',' '],over:false,player2:false,turn:''};
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadContractBoard = this.loadContractBoard.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.setTurn = this.setTurn.bind(this);

        const web3 = new Web3("ws://127.0.0.1:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.printPlayers().call()
        .then((res)=>{
            console.log(res);
            if(res[1]!=="0x0000000000000000000000000000000000000000"){
                var temp = this.state;
                temp.player2 = true;
                this.setState(temp);
                this.setTurn();
            }
        });
        console.log(contract.events.boardUpdated);
        contract.events.boardUpdated((error, event)=>{ this.setTurn();console.log(event); })
        .on('data', function(event){
            let x = parseInt(event.returnValues['x']);
            let y = parseInt(event.returnValues['y']);
            contract.methods.tostring(x,y).call()
            .then((res)=>{
                document.getElementById(x*3+y).innerHTML = res; 
            });

        });
        contract.events.gameOver((error,event)=>{ console.log(event);})
        .on('data',(event)=>{
            console.log(event.returnValues[0]);
            var state = this.state;
            state.over = true;
            this.setState(state);
            contract.methods.getGames().call()
            .then((res)=>{
                console.log(res);
                console.log(typeof(res));
                if(parseInt(res)===3)
                {
                    sessionStorage.removeItem('address');
                    sessionStorage.removeItem('abi');
                }
            });
            
        });
        contract.events.newGameStarted((error,event)=>{ console.log(event);})
        .on('data',(event)=>{
            var state = this.state;
            state.over = false;
            this.setState(state);
            this.loadContractBoard();
            this.setTurn();
        });
        contract.events.playerJoined((error,event)=>{ console.log(event);})
        .on('data',()=>{
            contract.methods.printPlayers().call()
            .then((res)=>{
                console.log(res);
                var temp = this.state;
                temp.player2 = true;
                this.setState(temp);
                this.setTurn();
            });
        });
    }

    loadContractBoard(){
        var state = this.state;
        const web3 = new Web3("ws://127.0.0.1:8545");
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
        const web3 = new Web3("ws://127.0.0.1:8545");
        console.log(event.target.id);
        let account = sessionStorage.getItem('account');
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.printPlayers().call({from: account})
        .then((res)=>{
            console.log(res);
        });
        contract.methods.Move(Math.floor(event.target.id/3),event.target.id%3).send({from: sessionStorage.getItem('account'),gas:3000000})
        .then(()=>{
            contract.methods.tostring(0,0).call({from: sessionStorage.getItem('account')})
            .then((res)=>{
                console.log(res);
            })
        });
    }


    startNewGame(event){
        event.preventDefault();
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        console.log(event.target.id);
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.startNewGame().send({from:sessionStorage.getItem('account'),gas:3000000});
        var state = this.state;
        state.over=false;
        this.setState(state);
    }

    setTurn(){
        const web3 = new Web3("ws://127.0.0.1:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.turn().call()
        .then((res)=>{
            var temp = this.state;
            temp.turn = res;
            this.setState(temp);
        });
    }

    componentDidMount(){
        console.log(this.props.appstate);
        if(this.props.appstate.address){
            this.loadContractBoard();
        }
        const web3 = new Web3("ws://127.0.0.1:8545");
        let abi = JSON.parse(sessionStorage.getItem('abi'));
        let address = sessionStorage.getItem('address');
        let contract = new web3.eth.Contract(abi,address);
        contract.methods.printPlayers().call()
        .then((res)=>{
            if(res[1]!=="0x0000000000000000000000000000000000000000"){
                var temp = this.state;
                temp.player2 = true;
                this.setState(temp);
            }
        });
    }

    


    render() {
        
        if(!this.state.player2){
            return(<p>Waiting for player 2 to join</p>)
        }
        if(this.state.over){
            return(<button className="btn btn-primary" onClick={this.startNewGame}>Start New Game</button>)
        }
        else{
            return (
                <table>
                    <thead>
                        <tr>
                            <td colSpan="3">Turn: {this.state.turn}</td>
                        </tr>
                        <tr>
                            <td colSpan="3">Your address: {sessionStorage.getItem('account')}</td>
                        </tr>
                    </thead>
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
}
export default Board;