// import libraries
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react';
import axios from "axios"
import date from 'date-and-time';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import jwt_decode from 'jwt-decode';
import {useImmer} from "use-immer"

// import components
import NavBar from "./components/NavBar";
import Main from './components/pages/Main';
import RestDetail from './components/pages/RestDetail';
import SignUp from './components/pages/SignUp';
import Login from './components/pages/Login';
import AddEditRest from "./components/pages/AddEditRest"
import LoadingComp from './components/LoadingComp';
import ModalTest from './components/pages/ModalTest';

// import source data
import { checkboxFilters } from "./sourceData/filters"

// require functions
import getCoord from "./helperFunctions/getCoord"
import dateConverter from "./helperFunctions/dateConverter"
import geoLocation from "./helperFunctions/geoLocation"
// const dateConverter = require("./helperFunctions/dateConverter")
// const getCoord = require("./helperFunctions/getCoord.js")
// const geoLocation = require("./helperFunctions/geoLocation.js")
// const Main = lazy(() => import('./components/pages/Main'))
// const RestDetail = lazy(() => import('./components/pages/RestDetail'))

const fmtDate = date.format(new Date(), 'dddd')

function App() {
  // variables
  const [allRestaurants, setAllRestaurants] = useState([])
  const [filterParams, setFilterParams] = useImmer(checkboxFilters)
  const [currentLocation, setCurrentLocation] = useImmer({
    latitude:0,
    longitude:0
  })
  // const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [showRestaurants, setShowRestaurants] = useState([])
  const [dow, setDow] = useState(fmtDate)
  const [searchTerm, setSearchTerm] = useState("")
  const [locParams, setLocParams] = useImmer({
    lat: 0,
    long: 0,
    location: ""
  })  

  // restaurant filter function
  const filterRests = (filterArr, restData) => {
    const trueFilters = filterArr.filter(filterParam => filterParam.value)
    const filteredRestaurants = restData.filter((rest) => {
      // console.log(rest)  
      for (let i = 0; i < trueFilters.length; i++) {
        // console.log(rest[trueFilters[i].name])
        if (!rest.filterParams[trueFilters[i].name]) {
          return false
        }
      }
      return true
    })
    // console.log("filteredRestaurants", filteredRestaurants)
    return filteredRestaurants
  }

  // API call to backend for all restaurant data. 
  // need to be filtered on server side based on location distance
  const getRestaurants = async () => {
    let queryString = "?"
    let andAdder = ""
    let globalIdx = 0
    console.log("filterParams:", filterParams)
    filterParams.forEach((param,idx)=>{
      if (globalIdx !== 0) {
        andAdder = "&"
      }
      if (param.value === true) {
        queryString += `${andAdder}${param.name}=${true}`
        globalIdx += 1
      }
    })
    console.log("locParams:", locParams)
    const locParamsArr = Object.entries(locParams)
    locParamsArr.forEach((locParam)=>{
      if (globalIdx !== 0) {andAdder = "&"}
        queryString += `${andAdder}${locParam[0]}=${locParam[1]}`
        globalIdx += 1
    })
    console.log("queryString:",queryString)

    try {
      // console.log(filterObj)   
      const gotRests = await axios.get(`${process.env.REACT_APP_SERVER_URL}/restaurants`)
      return gotRests.data
    } catch (error) {
      console.warn(error)
    }
  }

  const filterRestByDay = (filteredRests, dayOweek) => {
    const numOweek = dateConverter(dayOweek, false)
    const filterRestsByDay = filteredRests.filter((rest) => {
      const filterFlag = rest.hourSet?.hours.some((e) => e.day === numOweek && (e.hasHH1 === true || e.hasHH2 === true))
      console.log(filterFlag)
      return filterFlag
    })
    return filterRestsByDay
  }

  // initial loading of data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await geoLocationSetter()
        const allRests = await getRestaurants()
        setAllRestaurants(allRests)
        setShowRestaurants(await filterRestByDay(allRests, dow))
      } catch (error) {
        console.warn(error)
      }
    }
    loadInitialData()    
  }, [])

  // // geolocation setter
  // useEffect(()=>{
  //   geoLocationSetter()
  // })

  const geoLocationSetter = async () => {
    try {
      const latLong = await geoLocation()
      console.log("latLong:",latLong)
       setLocParams((draft)=>{
          draft.lat = latLong.latitude
          draft.long = latLong.longitude
          draft.location = "Current Location"
        })
        setCurrentLocation((draft)=>{
          draft.latitude = latLong.latitude
          draft.longitude = latLong.longitude
        })
      //   console.log(locParams)
    } catch (error) {
      console.warn(error)
    }
  }

  // re-render list on filterParams Change. may want to change this to a server call. 
  useEffect(()=>{
        const filteredRests = filterRests(filterParams, allRestaurants)   
        const numOweek = dateConverter(dow, false)
        const filterRestsByDay = filteredRests.filter((rest) => {
          const filterFlag = rest.hourSet?.hours.some((e) => e.day === numOweek && (e.hasHH1 === true || e.hasHH2 === true))
          console.log(filterFlag)
          return filterFlag
        })
        setShowRestaurants(filterRestsByDay)
  },[filterParams])

  // useEffect(() => {
  //   return console.log("dow", dow)
  // })

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Router>

        <NavBar />
        
          <Routes>
            {/* website routes */}
            <Route
              path="/"
              element={<Main
                allRestaurants={showRestaurants}
                setFilterParams={setFilterParams}
                filterParams={filterParams}
                setDow={setDow}
                dow={dow}
              />}
            />

            <Route
              path="/restaurant/:id"
              element={<RestDetail />}
            />

            <Route
              path='/editrestaurant/:id'
              element={<AddEditRest 
                currentLocation={currentLocation}
              />}
            />


            {/* <Route
          path="/account"
          element={<RestDetail/>}
        /> */}

            <Route
              path="/addnewrestaurant"
              element={<AddEditRest 
                currentLocation={currentLocation}
              />}
            />
            <Route
              path="/signup"
              element={<SignUp />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/modalTest"
              element={<ModalTest />}
            />        

          </Routes>
        
      </Router>
    </QueryClientProvider>
  );
}

export default App;
