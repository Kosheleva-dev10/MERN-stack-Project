import React, { Fragment, useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/admin';
import CustomerLayout from './layouts/customer';
import AnonymousLayout from './layouts/anonymous';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import PaymentPage from './pages/auth/payment';

// Components
import { LoadingSpinner } from './components/common/spinner';
import ToastList from './components/common/toast-list';

// Utils
import { connectAuthCheck } from './common/redux/connects';
import { isAdmin } from './common/utils/auth';

function App({ history, tokenVerified, authenticated, userRole, verifyAccessTokenAction }) {
  useEffect(() => {
    verifyAccessTokenAction(history, false);
  });

  const renderApp = () => (<Fragment>
    <ToastList />
    <Switch>
      <Route path='/admin'>
        {authenticated && isAdmin(userRole) ? <AdminLayout /> : <Redirect to='/' />}
      </Route>
      <Route path='/customer'>
        {authenticated && !isAdmin(userRole) ? <CustomerLayout /> : <Redirect to='/' />}
      </Route>
      <Route path='/payment'>
        <PaymentPage />
      </Route>
      <Route path='/register'>
        <RegisterPage />
      </Route>
      <Route path='/'>
        <LoginPage />
      </Route>
    </Switch>
  </Fragment>
  );

  return (
    <Fragment>
      {!tokenVerified ? <LoadingSpinner /> : renderApp()}
    </Fragment>

  );
}

export default withRouter(connectAuthCheck(App));
