import React,{Component} from 'react';
import './Board.css';

class Board extends Component {
    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        console.log(event.target.id);
        this.props.appstate.contract.methods.printPlayers().call({from: this.props.appstate.account})
        .then((res)=>{
            console.log(res);
        });
        this.props.appstate.contract.methods.PlayerMoves(event.target.id).send({from: this.props.appstate.account})
        .then(()=>{
            this.props.appstate.contract.methods.tostring(event.target.id/3,event.target.id%3).call({from: this.props.appstate.account})
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
                        <td className="hori" id="3"></td>
                        <td className="vert hori" id="4"></td>
                        <td className="hori" id="5"></td>
                    </tr>
                    <tr>
                        <td id="6"></td>
                        <td id="7" className="vert"></td>
                        <td id="8"></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
export default Board;