import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import shortid from 'shortid'
import moment from 'moment'
import axios from 'axios'
import Exit from './Exit'

const Main = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)

    useEffect(() => {
        let item = Cookies.get('user')     
       
        if (item !== undefined) {
          if (JSON.parse(item) !== null) {
            setUsers(JSON.parse(item))
          }
        } else {
            setUsers(null)
        }
    }, [])

   
  
    return (
      <div className="con">
          <h2>Main</h2>
          <Exit />
      </div>
    )
}

export default Main