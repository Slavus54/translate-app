import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'

const MyOrders = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [profile, setProfile] = useState(null)

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

    const [getUserInfo] = useMutation(getUserInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getUserInfo !== undefined) {
                console.log(result.data.getUserInfo)
                setProfile(result.data.getUserInfo)
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

    const onAccepten = (shortid, name) => {
        if (user !== null && profile !== null) {
            
        }
    }

    return (
        <div className="con">
            <h2>Own orders</h2>
            <div className="invs">
                {profile !== null && user !== null && profile.orders.filter(e => e.creator === user.name).map(el => (
                    <Card className="inv">
                        <CardContent>
                            <Typography>{el.title}</Typography>
                            <Typography>{el.description}</Typography>
                            <Typography>{el.days} days</Typography>
                            <Typography>{el.price}p</Typography>
                            <h3>Rates</h3>
                            <div className="invs">
                                {el.rates.filter(e => e.accepted === false).map(e => (
                                    <>
                                        <span>{e.name}</span>
                                        <b>{e.price}p</b>
                                        <span>{e.days} days</span>
                                        <Button onClick={() => onAccepten(el.shortid, e.name)}>Accept</Button>
                                    </>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <h2>To do orders</h2>
            <div className="invs">
                {profile !== null && user !== null && profile.orders.filter(e => e.creator !== user.name).map(el => (
                    <Card className="inv">
                        <CardContent>
                            <Typography>{el.title}</Typography>
                            <Typography>{el.description}</Typography>
                            <Typography>{el.days} days</Typography>
                            <Typography>{el.price}p</Typography>
                            <Typography>{el.rates.length} rates</Typography>
                            <Typography>accepted: {el.accepted.toString()}</Typography>
                            {el.accepter === user.name && 
                            <>
                               {el.link !== '' && <Typography>{el.link}</Typography>}
                               {el.image !== '' && <img src={el.image} className="photo" />}
                            </>
                            }
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default MyOrders