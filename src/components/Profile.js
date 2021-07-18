import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'

const Profile = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [profile, setProfile] = useState(null)
    const [portfolio, setPortfolio] = useState(null)

    useEffect(() => {
        let item = JSON.parse(Cookies.get('user'))
  
        if (item !== null) {
            setUsers(item)
        } else {
            setUsers(null)
        } 
    }, [])

    const getUserInfoM = gql`
        mutation getUserInfo($name: String!) {
            getUserInfo(name: $name) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
                portfolio
                orders {
                    shortid
                    creator
                    title
                    description
                    link
                    image
                    price
                    days
                    rates {
                        name
                        msg
                        price
                        days
                        accepted
                    }
                    accepter
                    accepted
                    completed
                }
            }
        }
    `

    const addPortfolioM = gql`
        mutation addPortfolio($name: String!, $portfolio: String!) {
            addPortfolio(name: $name, portfolio: $portfolio) 
        }
    `

    const [getUserInfo] = useMutation(getUserInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getUserInfo !== undefined) {
                console.log(result.data.getUserInfo)
                setProfile(result.data.getUserInfo)
            }
        }
    })

    const [addPortfolio] = useMutation(addPortfolioM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.addPortfolio !== undefined) {
                console.log(result.data.addPortfolio)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getUserInfo({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const onAddPortfolio = () => {
        if (user !== null) {
            addPortfolio({
                variables: {
                    name: user.name, portfolio
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Profile</h2>
            {profile !== null && profile.portfolio === '' &&
            <>
                <h3>Add portfolio</h3>
                <TextField value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="Enter link of portfolio" />
                <Button onClick={onAddPortfolio}>Add</Button>
            </>   
            }
        </div>
    )
}

export default Profile