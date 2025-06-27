import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import LoginPage from './views/pages/partials/loginPage'
import ChangePasswordRecep from './views/pages/receptionist/ChangePasswordRecep'
import ChangePasswordDoc from './views/pages/doctor/ChangePasswordDoc'
import RecepNav from './views/pages/partials/recepNav'
import ApproveDoctors from './views/pages/receptionist/ApproveDoctors'
import DoctorNav from './views/pages/partials/DoctorNav'
import PatientRegistration from './views/pages/receptionist/PatientRegistration'
import AppointmentScheduling from './views/pages/receptionist/AppointmentScheduling'
import PatientList from './views/pages/receptionist/patientList'
import TokenGeneration from './views/pages/receptionist/TokenGeneration'
import ShowTokens from './views/pages/receptionist/showTokens'
import BillingPage from './views/pages/receptionist/BillingPage'
import BillingGeneratingPage from './views/pages/receptionist/BillingGeneratingPage'
import TotalBillingPage from './views/pages/receptionist/TotalBillingPage'
import RecepDashboard from './views/pages/receptionist/RecepDashboard'
import PatientListPage from './views/pages/doctor/patientProfile'
import MedicalHistoryDoctor from './views/pages/doctor/MedicalHistoryDoctor'
import PatientConsultationPage from './views/pages/doctor/PatientConsultationPage'
import DoctorDashboard from './views/pages/doctor/DoctorDashboard'
import ClinicHomepage from './views/pages/partials/Home'
import AuthenticateDoctor from './views/pages/doctor/AuthenticateDoc'
import AuthenticateReceptionist from './views/pages/receptionist/AuthenticateRecep'


function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      {/*Login*/}
      <Route path='/' element={<ClinicHomepage/>}/>
      <Route path='/login' element={<LoginPage/>}/>

       {/* Receptionist */}
       <Route element={<AuthenticateReceptionist/>}>
       <Route path='/RecepNav' element={<RecepNav/>}/>
       <Route path='/Change-Password-receptionist' element={<ChangePasswordRecep/>} />
       <Route path='/Approve-Doctors' element={<ApproveDoctors/>}/>
       <Route path='/Register-Patient' element={<PatientRegistration/>}/>
       <Route path='/Appoinment-Shedule' element={<AppointmentScheduling/>}/>
       <Route path='/Patient-List' element={<PatientList/>}/>
       <Route path='/Token-Generation' element={<TokenGeneration/>}/>
       <Route path='/Show-Generated-Tokens' element={<ShowTokens/>}/>
       <Route path='/Billing-receptionist' element={<BillingPage/>}/>
       <Route path='/Generate-Bills' element={<BillingGeneratingPage/>}/>
       <Route path='/TotalBills-Page' element={<TotalBillingPage/>}/>
       <Route path='/Recep-Dasboard-Page' element={<RecepDashboard/>}/>
       </Route>
       


      {/* Doctor */}
      <Route element={<AuthenticateDoctor/>}>
      <Route path='/DoctorNav' element={<DoctorNav/>}/>
      <Route path='/Change-Password-Doctor' element={<ChangePasswordDoc/>}/>
      <Route path='/Patient-List-Page' element={<PatientListPage/>}/>
      <Route path='/Medical-History-Doctor' element={<MedicalHistoryDoctor/>}/>
      <Route path='/Patient-Consultation-Page' element={<PatientConsultationPage/>}/>
      <Route path='/Doctor-Dashboard-Page' element={<DoctorDashboard/>}/>
      </Route>
      

  
      </Routes>
    </BrowserRouter>
  )
}

export default App
