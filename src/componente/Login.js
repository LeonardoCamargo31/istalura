import React, { Component } from 'react'
import {browserHistory} from 'react-router';

export default class Login extends Component {
    constructor(props){
        //Passamos o props para o super(), e teremos acesso com this com o props configurado corretamente
        super(props)
        this.state = {msg:this.props.location.query.msg};
    }

    envia(evento){
        evento.preventDefault()
        
        //const ninguem mais pode atribuir valores a ela
        const requestInfo = {
            method:'POST',
            body:JSON.stringify({login:this.login.value,senha:this.senha.value}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        }

        fetch('https://instalura-api.herokuapp.com/api/public/login',requestInfo)
        .then(response => {
            if(response.ok){
                return response.text();
            } else {
                //assim interrompe o fluxo
                throw new Error('Não foi possível fazer o login');
            }
        }).then(token => {
            //okay deu certo, temos o token
            localStorage.setItem('auth-token',token)
            browserHistory.push('/timeline');//para navegar a esse endereço
        }).catch(error => {
            this.setState({msg:error.message});
        });
    }

    render() {
        return (
        <div className="login-box">
            <h1 className="header-logo">Instalura</h1>
            <span>{this.state.msg}</span>
            <form onSubmit={this.envia.bind(this)}>
                <input type="text" ref={(input) => this.login = input} />
                <input type="password" ref={(input) => this.senha = input} />
                <input type="submit" value="login" />
            </form>
        </div>)
    }
}