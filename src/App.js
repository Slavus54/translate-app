import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {Link, Route} from 'wouter'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import moment from 'moment'
import Main from './components/Main'
import Welcommen from './components/Welcommen'
import Profile from './components/Profile'
import Create from './components/Create'
import Orders from './components/Orders'
import Order from './components/Order'
import MyOrders from './components/MyOrders'
import './App.css'

function App() {
  const [user, setUsers] = useState(null)
  const [form, setForm] = useState(null)

  const onGet = () => {
    // fields.map(el => {
    //   let item = document.getElementById(`${el.id}`)

    //   console.log(item.getAttribute('value'))
    // })
  }

  useEffect(() => {
    let item = Cookies.get('user')       

    if (item !== undefined && JSON.parse(item) !== null) {
        setUsers(JSON.parse(item))
    } 
  }, [])



  return (
    <div className="App">
      <Button onClick={onGet}>GET</Button>
      {user === null &&
        <nav>
          <Link href="/">Home</Link>
          <Link href="/reg">Register/Login</Link>
        </nav>
      }

      {user !== null &&
        <nav>
          <Link href="/">Home</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/create-order">Create order</Link>
          <Link href="/myorders">My orders</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      }
      {/* <div id="place"></div> */}
     
      
      <Route path="/" component={user !== null ? Main: Welcommen} /> 
      <Route path="/reg" component={Welcommen} />  
      <Route path="/profile" component={Profile} />
      <Route path="/create-order" component={Create} />    
      <Route path="/orders" component={Orders} />    
      <Route path="/order/:id" component={Order} />  
      <Route path="/myorders" component={MyOrders} />    
      {/* <Route path="/reg" component={Welcommen} /> */}
      {/* <Route path="/create" component={Create} /> 
      <Route path="/frequencies" component={Frequencies} /> 
      <Route path="/frequency/:id" component={Frequency} />  */}
      {/* <audio autoPlay={true} controls={true} src="https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3"></audio> */}
    </div>
  );
}

export default App;