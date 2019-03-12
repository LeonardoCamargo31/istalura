import React, { Component } from 'react';
import { Link } from 'react-router';

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

    render() {
        return (
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.props.foto.likers.map(liker => {
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
                    {this.props.foto.comentarios.map(comentario => {
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

    like(e) {
        e.preventDefault()
        this.props.like(this.props.foto.id);
    }

    comenta(e) {
        e.preventDefault()
        this.props.comenta(this.props.foto.id, this.comentario.value);
    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.like.bind(this)} className={this.props.foto.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
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
                {/*<FotoAtualizacoes foto={this.props.foto} like={this.props.like} comenta={this.props.comenta}/>*/}
                <FotoAtualizacoes {...this.props} />{/*usando o spreed operator do es6*/}
            </div>
        )
    }
}