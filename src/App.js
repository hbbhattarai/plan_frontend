import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import PrecientView from './components/admin/precient/PrecientView';
import PlanList from './components/admin/plan/Plans';
import PlotDashoard from './components/admin/plot/PlotView';
import Dashboard from "./components/admin/dashboard/Dashboard"
import Login from "./components/auth/Login"
import SinglePlan from "./components/admin/plan/Plan"

import UserDashboard from "./components/user/dashboard/Dashboard"
import UserPrecientView from './components/user/precient/PrecientView';
import UserPlotDashoard from './components/user/plot/PlotView';
import UserSinglePlan from "./components/user/plan/Plan"
// import useToken from './useToken';


const App = () => {

  // const { token, setToken } = useToken()

  // if (!token) {
  //   return <Login setToken={setToken} />
  // }


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/dashboard' element={< Dashboard />}></Route>
          <Route exact path='/dashboard/precinet/:id' element={< PrecientView />}></Route>
          <Route exact path='//dashboard/plots/:plan_id/:plot_gid' element={< PlotDashoard />}></Route>
          <Route exact path='/dashboard/plans' element={< PlanList />}></Route>
          <Route exact path='/dashboard/plan/:id' element={< SinglePlan />}></Route>
          <Route exact path='/login' element={< Login />}></Route>
          <Route exact path='/' element={< UserDashboard />}></Route>
          <Route exact path='/precinet/:id' element={< UserPrecientView />}></Route>
          <Route exact path='/plots/:plan_id/:plot_gid' element={< UserPlotDashoard />}></Route>
          <Route exact path='/plan/:id' element={< UserSinglePlan />}></Route>
        </Routes>
      </div>
    </Router>

  )
}

export default App
