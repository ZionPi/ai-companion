import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import MainFrame from "./MainFrame";
import NavigatorComponent from './NavigatorComponent'
import { Provider } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import store from "./redux/config/store";
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ContactPage from './contact'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import ConversationComponent from './ConversationComponent'
// import SettingComponent from './SettingComponent'
import HistoryComponent from './HistoryComponent'
import RandomizeComponent from './RandomizeComponent'
import AccountComponent from './AccountComponent'
import LogoutComponent from './LogoutComponent'
import QACardList from './QACardList'
// Import the layouts
import RootLayout from './layouts/root-layout'
import SettingComponent from "./SettingComponent"
// import SignedIn from './SignedIn'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import StringSimulation from "./components/char/StringSimulation";
import FloatCharSimulation from "./components/char/float/FloatCharSimulation";
import {qaData} from './data/qadata'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <FloatCharSimulation />, index: true },
      { path: "/contact", element: <ContactPage /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        path: "/qacardlist", element: <> <SignedIn> <QACardList qaPairs={qaData} /> </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      },
      {
        path: "/conversation", element: 
           <><SignedIn > <ConversationComponent />  </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut> </>
        
      },
      {
        path: "/history", element: 

        <><SignedIn > <HistoryComponent /> </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut> </>
      },
      {
        path: "/randomize", element:
          <>
            <SignedIn><RandomizeComponent /> </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
      },
      { path: "/account", element: <AccountComponent /> },
      {
        path: "/logout", element: <>
          <LogoutComponent />
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      },
      {
        path: "/setting", element: <> <SignedIn> <SettingComponent /></SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      },
      // { path: "*", element: <SignedOut> <RedirectToSignIn /></SignedOut> }


      // {
      //   element: <MainFrame />,
      //   path: "dashboard",
      //   children: [
      //     { path: "/dashboard", element: <DashboardPage /> },
      //     { path: "/dashboard/invoices", element: <InvoicesPage /> }
      //   ]
      // }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
