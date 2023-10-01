import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './layout/App';
import reportWebVitals from './reportWebVitals';
import { fetchCompaniesAsync } from './slices/companiesSlice';
import { Provider } from 'react-redux';
import { store } from './app/store/ConfigureStore';
import { BrowserRouter } from 'react-router-dom';
// import AppRoutes from './routes/Routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
store.dispatch(fetchCompaniesAsync());
root.render(
  <React.StrictMode>
   <Provider store ={store}>
    <BrowserRouter>
       <App />
    </BrowserRouter>
   </Provider>
  </React.StrictMode>
);

reportWebVitals();
