import { TourProvider } from '@reactour/tour'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store, persistor } from './Store/Store';
import { PersistGate } from 'redux-persist/integration/react';

import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <TourProvider>


      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>


          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </TourProvider>
  </BrowserRouter>
);



