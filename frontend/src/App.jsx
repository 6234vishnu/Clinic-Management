import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import LoginPage from './views/pages/partials/loginPage'
import DoctorSignup from './views/pages/doctor/DoctorSignup'
import ChangePasswordRecep from './views/pages/receptionist/ChangePasswordRecep'
import ChangePasswordDoc from './views/pages/doctor/ChangePasswordDoc'
import DoctornavBar from './views/pages/partials/DoctornavBar'
import RecepNav from './views/pages/partials/recepNav'
import ApproveDoctors from './views/pages/receptionist/ApproveDoctors'


function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      {/*Login*/}
      <Route path='/' element={<LoginPage/>}/>


       {/* Receptionist */}
       <Route path='/Change-Password-receptionist' element={<ChangePasswordRecep/>} />
       {/* <Route path='/RecepNav' element={<RecepNav/>}/> */}
       <Route path='/Approve-Doctors' element={<ApproveDoctors/>}/>


      {/* Doctor */}
      <Route path='/Doctor-Signup' element={<DoctorSignup/>}/>
      <Route path='/Change-Password-Doctor' element={<ChangePasswordDoc/>}/>
      <Route path='/Doctor-Dashboard' element={<DoctornavBar/>}/>
  
      </Routes>
    </BrowserRouter>
  )
}

export default App
