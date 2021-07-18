import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Create = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [daten, setDaten] = useState({
        title: '',
        description: '',
        link: '',
        image: '',
        price: '',
        days: ''
    })

    const {title, description, link, image, price, days} = daten

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

    const createOrderM = gql`
        mutation createOrder($name: String!, $title: String!, $description: String!, $link: String!, $image: String!, $price: Int!, $days: Int!) {
            createOrder(name: $name, title: $title, description: $description, link: $link, image: $image, price: $price, days: $days)
        }
    `

    const [createOrder] = useMutation(createOrderM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createOrder !== undefined) {
                console.log(result.data.createOrder)
            }
        }
    })

    const onUpload = e => {
        const reader = new FileReader()

        reader.onload = ev => {
            setDaten({...daten, image: ev.target.result})
        }

        reader.readAsDataURL(e.target.files[0])
    }

    const onCreatenOrder = () => {
        if (user !== null) {
            createOrder({
                variables: {
                    name: user.name, title, description, link, image, price, days
                }
            })
        }
    }
   
    return (
        <div className="con">
            <h2>Заполните форму</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of order" />
            <TextareaAutosize value={description} onChange={e => setDaten({...daten, description: e.target.value})} placeholder="Enter description of order" rowsMin={5} />
            <h3>Добавьте ссылку на текст (медиа)</h3> 
            <TextField value={link} onChange={e => setDaten({...daten, link: e.target.value})} placeholder="Enter link of order" />
            <h3>или загрузите изображение (документ)</h3>
            <Button href="https://pdf2png.com">Конвертер файлов в изображение</Button>
            <TextField onChange={onUpload} type="file" />
            <TextField value={price} onChange={e => setDaten({...daten, price: parseInt(e.target.value)})} placeholder="Enter price of order" />
            <TextField value={days} onChange={e => setDaten({...daten, days: parseInt(e.target.value)})} placeholder="Enter days of order" />
            <Button onClick={onCreatenOrder}>Create</Button>
        </div>
    )
}

export default Create