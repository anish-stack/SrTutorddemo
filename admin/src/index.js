import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Store, persistor } from './Store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import Login from './pages/Auth/Login';
import { Toaster } from 'react-hot-toast';
import { checkLogin } from './Slices/LoginSlice';

// Component that decides which component to render based on the login state
const RootComponent = () => {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.login || {});

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  if (!loginState.isLogin || false) {
    return <Login />;
  }

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootComponent />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
