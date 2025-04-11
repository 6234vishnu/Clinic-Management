import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import LoginPage from './views/pages/partials/loginPage'
import DoctorSignup from './views/pages/doctor/DoctorSignup'
import ChangePasswordRecep from './views/pages/receptionist/ChangePasswordRecep'
import ChangePasswordDoc from './views/pages/doctor/ChangePasswordDoc'
import DoctornavBar from './views/pages/partials/DoctornavBar'
import RecepNav from './views/pages/partials/recepNav'
import ApproveDoctors from './views/pages/receptionist/ApproveDoctors'
import DoctorNav from './views/pages/partials/DoctorNav'
import PatientRegistration from './views/pages/receptionist/PatientRegistration'
import AppointmentScheduling from './views/pages/receptionist/AppointmentScheduling'
import PatientList from './views/pages/receptionist/patientList'
import TokenGeneration from './views/pages/receptionist/TokenGeneration'


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
       <Route path='/Register-Patient' element={<PatientRegistration/>}/>
       <Route path='/Appoinment-Shedule' element={<AppointmentScheduling/>}/>
       <Route path='/Patient-List' element={<PatientList/>}/>
       <Route path='/Token-Generation' element={<TokenGeneration/>}/>


      {/* Doctor */}
      <Route path='/Doctor-Signup' element={<DoctorSignup/>}/>
      <Route path='/Change-Password-Doctor' element={<ChangePasswordDoc/>}/>
      <Route path='/Doctor-Dashboard' element={<DoctornavBar/>}/>
      <Route path='/DoctorNav' element={<DoctorNav/>}/>
  
      </Routes>
    </BrowserRouter>
  )
}

export default App
