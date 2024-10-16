import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store, persistor } from './Store/Store';
import { PersistGate } from 'redux-persist/integration/react';

import { Toaster } from 'react-hot-toast';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);



