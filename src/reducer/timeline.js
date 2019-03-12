
//FUNÇÃO REDUCER
//estado inicial é um array vazio
export function timeline(state = [], action) {
    if (action.type === 'LISTAGEM') {
        //faça algo
        //a action sempre tera um type e um payload
        //la em time line dei um dispatch/expedição/enviar com valor payload, um fotos com o nosso json
        return action.fotos
    }
    if (action.type === 'LIKE') {
        const fotoAchada = state.find(foto => foto.id ===  action.fotoId);
        fotoAchada.likeada = !fotoAchada.likeada;//se tiver likeada, vamos deslikear

        const possivelLiker = fotoAchada.likers.find(likerAtual => {
            return likerAtual.login === action.liker.login
        });
        if (possivelLiker === undefined) {
            fotoAchada.likers.push(action.liker);
        }
        else {
            const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
            fotoAchada.likers = novosLikers
        }

        return state
    }

    if (action.type === 'COMENTARIO') {
        const fotoAchada = state.find(foto => foto.id === action.fotoId);
        fotoAchada.comentarios.push(action.novoComentario);

        return state
    }

    return state
}