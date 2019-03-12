//que faz acesso a api
export default class TimelineApi {

    static lista(urlPerfil) {
        return (dispatch) => {
            fetch(urlPerfil)
                .then(response => response.json())//assim que a resposta estiver pronta, e retornamos o json
                .then(fotos => {//passamos a fotos por parametro, setamos as fotos para o nosso STATE
                    dispatch({ type: 'LISTAGEM', fotos });//fotos shorthand
                    return fotos
                });
        }
    }

    like(fotoId) {
        return (dispatch) => {
            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("não foi possível realizar o like da foto");
                    }
                })
                .then(liker => {
                    dispatch({ type: 'LIKE', fotoId, liker });
                    return liker
                });
        }
    }


    static comenta(fotoId, textoComentario) {
        return (dispatch) => {
            //configurando nossa requisição
            const requestInfo = {
                method: 'POST',
                body: JSON.stringify({ texto: textoComentario }),
                headers: new Headers({
                    'Content-type': 'application/json'
                })
            };

            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token', requestInfo)}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("não foi possível comentar");
                    }
                }).then(novoComentario => {
                    dispatch({ type: 'COMENTARIO', fotoId, novoComentario })
                    return novoComentario
                })
        }
    }
}
