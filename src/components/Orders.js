import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Orders = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [orders, setOrders] = useState(null)

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

    const getOrdersM = gql`
        mutation getOrders($name: String!) {
            getOrders(name: $name) {
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
    `

    const [getOrders] = useMutation(getOrdersM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getOrders !== undefined) {
                console.log(result.data.getOrders)
                setOrders(result.data.getOrders)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getOrders({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Orders</h2>
            <div className="invs">
                {orders !== null && orders.map(el => (
                    <Card className="inv">
                        <CardContent>
                            <Typography>{el.title}</Typography>
                            <Typography>{el.days} days</Typography>
                            <Typography>{el.price}</Typography>
                        </CardContent>
                        <CardActionArea>
                            <Button onClick={() => setLoc(`/order/${el.shortid}`)}>Details</Button>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Orders