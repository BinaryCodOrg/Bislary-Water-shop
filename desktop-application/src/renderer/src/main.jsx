import './assets/Font.css'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RecoilRoot } from 'recoil'
import { ConfigProvider, notification } from 'antd'
import { HashRouter } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ConfigProvider
        notify={notification}
        theme={{
          token: {
            /* here is your global tokens */
            colorPrimary: '#3d4461'
          }
        }}
      >
        <RecoilRoot>
          <HashRouter>
            <App />
          </HashRouter>
        </RecoilRoot>
      </ConfigProvider>
    </HelmetProvider>
  </StrictMode>
)
