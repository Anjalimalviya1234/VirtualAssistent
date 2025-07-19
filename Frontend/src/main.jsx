
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, UNSAFE_RouteContext} from "react-router-dom"
import UserContext from './context/UserContext.jsx'
createRoot(document.getElementById('root')).render(
 <BrowserRouter>
<UserContext>
 <App />
</UserContext>
   
     </BrowserRouter>
 
)
