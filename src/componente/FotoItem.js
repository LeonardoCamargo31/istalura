import React, { Component } from 'react';
import { Link } from 'react-router';
import Pubsub from 'pubsub-js';


class FotoHeader extends Component {
    render() {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                    <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
                    <figcaption className="foto-usuario">
                        <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                            {this.props.foto.loginUsuario}
                        </Link>
                    </figcaption>
                </figure>
                <time className="foto-data">{this.props.foto.horario}</time>
            </header>
        )
    }
}
class FotoInfo extends Component {
    constructor(props) {
        super(props);
        //quem já curtiu a foto em especifico
        this.state = { likers: this.props.foto.likers,comentarios:this.props.foto.comentarios };
    }

    componentWillMount() {
        //Quando nos inscrevemos, temos que passar um função como argumento que será executada sempre que chegar uma nova mensagem. 
        Pubsub.subscribe('atualiza-liker', (topico, infoLiker) => {
            if (this.props.foto.id === infoLiker.fotoId) {
                const possivelLiker = this.state.likers.find(liker => {
                    return liker.login === infoLiker.liker.login
                });
                if (possivelLiker === undefined) {
                    //será gerado um novo array com nova informação concatenada
                    const novosLikers = this.state.likers.concat(infoLiker.liker);
                    this.setState({ likers: novosLikers });
                }
                else {
                    console.log('d')
                    //Queremos manter todos os likers que tiverem login diferente do infoLiker.login
                    //sempre que for true, significa que está certo e deverá ser mantido na nova lista
                    const novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.liker.login);
                    this.setState({ likers: novosLikers });
                }
            }
        });

        Pubsub.subscribe('novos-comentarios',(topico,infoComentario) => {
            if(this.props.foto.id === infoComentario.fotoId){
                const novosComentarios = this.state.comentarios.concat(infoComentario.novoComentario);
                this.setState({comentarios:novosComentarios});
            }
        });
    }

    render() {

        return (
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.state.likers.map(liker => {
                            return (<a key={liker.login} href="#">{liker.login},</a>
                            )
                        }
                        )}
                </div>

                <p className="foto-info-legenda">
                    <a className="foto-info-autor">{this.props.foto.loginUsuario} </a>
                    {this.props.foto.comentario}
                </p>

                <ul className="foto-info-comentarios">
                    {this.state.comentarios.map(comentario => {
                        return (<li key={comentario.login.id} className="comentario">
                            <Link to={`/timeline/${comentario.login} `} className="foto-info-autor">{comentario.login} </Link>
                            {comentario.texto}
                        </li>)
                    })}
                </ul>
            </div>
        )
    }
}

class FotoAtualizacoes extends Component {
    constructor(props) {
        super(props)
        this.state = { likeada: this.props.foto.likeada }
    }

    like(e) {
        e.preventDefault()
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Não foi possivel realizar o like')
                }
            }).then(liker => {
                //se houve uma curtida ou uma descurtida
                this.setState({ likeada: !this.state.likeada })
                //colocando apenas a variável liker, estas propriedades recebem o nome de shorthand property seria "propriedades abreviadas"
                Pubsub.publish('atualiza-liker', { fotoId: this.props.foto.id, liker });//passamos o id da foto e a informação do like
            })
    }

    comenta(e) {
        e.preventDefault()

        //configurando nossa requisição
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: this.comentario.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token', requestInfo)}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível comentar");
                }
            }).then(novoComentario => {
                //novoComentario shorthand
                Pubsub.publish('novo-comentarios', { fotoId: this.props.foto.id, novoComentario });
            })


    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.like.bind(this)} className={this.state.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
                <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input} />
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
                </form>
            </section>
        )
    }
}

export default class FotoItem extends Component {
    render() {
        return (
            <div className="foto">
                <FotoHeader foto={this.props.foto} />
                <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
                <FotoInfo foto={this.props.foto} />
                <FotoAtualizacoes foto={this.props.foto} />
            </div>
        )
    }
}