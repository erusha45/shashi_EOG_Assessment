import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import EOGDashboard from './components/EOGDashboard';
import { Container } from '@material-ui/core';

const store = createStore();

const App = props => (
  <MuiThemeProvider>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <Header />
        <Container>
          <EOGDashboard />
          <ToastContainer />
        </Container>
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
