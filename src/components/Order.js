import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
import Modal from 'react-awesome-modal'

const Order = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [order, setOrder] = useState(null)
    const [open, setOpen] = useState(false)
    const [daten, setDaten] = useState({
        msg: '',
        price: '',
        days: ''
    })

    const {msg, price, days} = daten
    
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

    const getOrderM = gql`
        mutation getOrder($shortid: String!) {
            getOrder(shortid: $shortid) {
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

    const addOrderM = gql`
        mutation addOrder($name: String!, $shortid: String!, $creat: String!, $msg: String!, $price: Int!, $days: Int!) {
            addOrder(name: $name, shortid: $shortid, creat: $creat, msg: $msg, price: $price, days: $days)
        }
    `

    const [getOrder] = useMutation(getOrderM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getOrder !== undefined) {
                console.log(result.data.getOrder)
                setOrder(result.data.getOrder)
            }
        }
    })

    const [addOrder] = useMutation(addOrderM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.addOrder !== undefined) {
                console.log(result.data.addOrder)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getOrder({
                variables: {
                    shortid: params.id
                }
            })
        }
    }, [user])

    const onGetOrder = () => {
        if (user !== null && order !== null) {
            addOrder({
                variables: {
                    name: user.name, shortid: order.shortid, creat: order.creator, msg, price, days
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Order</h2>
            {order !== null &&
            <>
                <h3>{order.title}</h3>
                {order.accepter === '' &&
                <>
                    <Button onClick={() => setOpen(true)}>Get order</Button>
                    <Modal visible={open} width="400" height="300" effect="fadeInUp" onClickAway={() => setOpen(false)}>
                        <div className="con">
                            <Button onClick={() => setOpen(false)}>&times;</Button>
                            <TextField value={msg} onChange={e => setDaten({...daten, msg: e.target.value})} placeholder="Enter message to customer" />
                            <TextField value={price} onChange={e => setDaten({...daten, price: parseInt(e.target.value)})} placeholder="Enter price of work" />
                            <TextField value={days} onChange={e => setDaten({...daten, days: parseInt(e.target.value)})} placeholder="Enter days of work" />
                            <Button onClick={onGetOrder}>Get</Button>
                        </div>
                    </Modal>
                </>
                }
            </>
            }
        </div>
    )
}

export default Order