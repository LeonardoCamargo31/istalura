import React, { Component } from 'react';
import FotoItem from './FotoItem'
import TimelineApi from '../logicas/TimelineApi'
//transição animada
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
    }

    componentWillMount() {
        //sempre que tiver mudanças na timeline, executa essa função
        this.props.store.subscribe(() => {
            this.setState({fotos:this.props.store.getState()});
        })
    }

    carregaFotos() {

        let urlPerfil = ''
        if (this.login === undefined) {//se não passou parametro
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }
        //ao invés de dispachar uma action normal com action e payload
        //vamos despachar uma função que pode por exemplo retornar uma promisse, e o redux thunk vai conseguir lidar com isso
        //ele vai receber a função como argumento, vai executa-la e depois vai executar o dispach
        this.props.store.dispatch(TimelineApi.lista(urlPerfil))
        //TimelineApi.lista(urlPerfil, this.props.store)
    }

    componentDidMount() {
        this.carregaFotos();
    }

    //quando clicamos no link de navegação para ver a timeline de um amigo nosso, precisamos forçar que o componente da Timeline seja renderizado novamente.
    // com o qual teremos acesso às novas propriedades passadas para o componente. Pediremos que ele seja renderizado novamente passando novas propriedades. 
    componentWillReceiveProps(nextProps) {
        //se as novas propriedades são diferente de undefined
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    like(fotoId) {
        this.props.store.dispatch(TimelineApi.like(fotoId))
    }

    comenta(fotoId, textoComentario) {
        this.props.store.dispatch(TimelineApi.comenta(fotoId,textoComentario))
    }

    render() {
        console.log(this.state.fotos)
        return (
            <div className="fotos container">
                <TransitionGroup className="timeline">
                    {this.state.fotos.map(foto => (
                        <CSSTransition
                            key={foto.id}
                            timeout={500}
                            classNames="fade">
                            <FotoItem foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)} />
                        </CSSTransition>
                    ))}
                </TransitionGroup >
            </div>
        )
    }
}