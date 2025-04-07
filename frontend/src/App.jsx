import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import LoginPage from './views/pages/partials/loginPage'
import DoctorSignup from './views/pages/doctor/DoctorSignup'
import ChangePasswordRecep from './views/pages/receptionist/ChangePasswordRecep'
import ChangePasswordDoc from './views/pages/doctor/ChangePasswordDoc'
import OtpModal from './components/enterOtpModal'


function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      {/*Login*/}
      <Route path='/' element={<LoginPage/>}/>


       {/* Receptionist */}
       <Route path='/Change-Password-receptionist' element={<ChangePasswordRecep/>} />


      {/* Doctor */}
      <Route path='/Doctor-Signup' element={<DoctorSignup/>}/>
      <Route path='/Change-Password-Doctor' element={<ChangePasswordDoc/>}/>
  
    </Routes>
    </BrowserRouter>
  )
}

export default App
