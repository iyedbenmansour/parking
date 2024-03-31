import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/USER/home/Home";
import Booking from "./pages/USER/Booking";
import Login from "./pages/USER/Login";
import Register from "./pages/USER/Register";
import ContactUs from "./pages/USER/ContactUs";
import Cattegory from "./pages/USER/Cattegory";
import Payment from "./pages/USER/Payment";
import Profile from "./pages/USER/profile/Profile";
import EditP from "./pages/USER/profile/EditP";
import AllBook from "./pages/ADMIN/AllBook";
import AllUser from "./pages/ADMIN/AllUser";
import Alladmins from "./pages/ADMIN/Alladmin";
import Allticket from "./pages/ADMIN/Allticket";
import Admin from "./pages/ADMIN/Admin";
import Addadmin from "./pages/USER/Addadmin";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/booking" element={<Booking/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/contactus" element={<ContactUs/>}/>
          <Route path="/category" element={<Cattegory/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/edit" element={<EditP/>}/>
          <Route path="/allbooking" element={<AllBook/>}/>
          <Route path="/alluser" element={<AllUser/>}/>
          <Route path="/alladmin" element={<Alladmins/>}/>
          <Route path="/allticket" element={<Allticket/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/addadmin" element={<Addadmin/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
