import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './components';
import reportWebVitals from './reportWebVitals';
import './styles.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from './firebaseConfig';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Provider store={store}>
        <Home title={'ProducerFinder'} />
      </Provider>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();