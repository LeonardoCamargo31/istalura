import React, { Component } from 'react';
import Header from './componente/Header'
import Timeline from './componente/Timeline'
import { createStore ,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { timeline } from './reducer/timeline'

//então passamos nossa função 
const store = createStore(timeline,applyMiddleware(thunkMiddleware));//então temos uma unica store, diferente do padrão flux

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header />
          {/* o react-router vai instanciar internamente o componente e passará com parâmetro deste o valor da sua rota*/}
          <Timeline login={this.props.params.login} store={store} />
        </div>
      </div>
    );
  }
}

export default App;
