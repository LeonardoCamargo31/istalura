import React, { Component } from 'react';
import FotoItem from './FotoItem'

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
    }

    carregaFotos() {
        //var consulta = fetch('https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API')
        //Vemos que consulta é um objeto do tipo Promise
        //fetch(`https://instalura-api.herokuapp.com/api/public/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`)
        let urlPerfil = ''
        if (this.login === undefined) {//se não passou parametro
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())//assim que a resposta estiver pronta, e retornamos o json
            .then(fotos => {//passamos a fotos por parametro, setamos as fotos para o nosso STATE
                this.setState({ fotos: fotos });
            });
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

    render() {
        return (
            <div className="fotos container">
                {
                    this.state.fotos.map(foto => <FotoItem foto={foto} />)
                }
            </div>
        )
    }
}