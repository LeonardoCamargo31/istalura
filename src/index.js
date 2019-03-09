import React from 'react';
import ReactDOM from 'react-dom';

import './css/reset.css'
import './css/timeline.css'
import './css/login.css'

import Logout from './componente/Logout';
import App from './App';
import Login from './componente/Login';

import { Router, Route, browserHistory } from 'react-router';
import {matchPattern} from 'react-router/lib/PatternUtils';

//É uma forma melhor de controlarmos o acesso a rota. Se tivermos várias rotas, conseguimos colocar o onEnter
function verificaAutenticacao(nextState,replace) {
    //verificar se acessar /timeline(/:login), deixa acessar
    //matchPattern queremos comparar /timeline(/:login) contra o endereço que esta sendo acessado
    const resultado = matchPattern('/timeline(/:login)',nextState.location.pathname);//proximo estado
    //retorna dois paramNames: ["login"] paramValues: ["rafael"]
    //http://..timeline/rafael se fosse só timeline seria paramValues: [undefined]
    const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;//se tiver undefined quer dizer que estamos no endereço privado, que recebe true
    console.log(resultado);

    if(enderecoPrivadoTimeline && localStorage.getItem('auth-token') === null){
      replace('/?msg=você precisa estar logado para acessar o endereço');
    }
}

ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={Login} />
            {/*timeline(/:login) parametro opicional*/}
            <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao} />
            <Route path="/logout" component={Logout} />
        </Router>
    ),
    document.getElementById('root')
);