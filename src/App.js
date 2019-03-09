import React, { Component } from 'react';
import Header from './componente/Header'
import Timeline from './componente/Timeline'
class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header/>
          {/* o react-router vai instanciar internamente o componente e passará com parâmetro deste o valor da sua rota*/}
          <Timeline login={this.props.params.login}/>
        </div>
      </div>
    );
  }
}

export default App;
