import React, { useEffect, useState } from 'react'
import {Box, Button, TextField} from "@mui/material"
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState('')
    const [orderId, setOrderId] = useState('')
    const [total, setTotal] = useState(0)

    const [token, setToken] = useState('')

    const process = async () => {
      const data = {
        name: name,
        orderId: orderId,
        total: total
      }

      const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const response = await axios.post("http://localhost:1000/api/payment/process-transaction", data, config)

    setToken(response.data.token)
    }

    useEffect(() => {
      if(token) {
        window.snap.pay(token, {
          onSuccess: (result) => {
            console.log('sukses');
            console.log(result);
            localStorage.setItem("Pembayaran", JSON.stringify(result))
            setToken('');
          },
          onPending: (result) => {
            console.log('pending');
            console.log(result);
            localStorage.setItem("Pembayaran", JSON.stringify(result))
            setToken('');

          },
          onError: (error) => {
            console.log(error)
            setToken('');
          },
          onClose: () => {
            console.log("Anda belum menyelesaikan pembayaran");
            setToken('');
          }
        })


        setName('');
        setOrderId('');
        setTotal('')
      }
    }, [token])

    useEffect(() => {
      const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

      let scriptTag = document.createElement("script");
      scriptTag.src = midtransUrl;

      const midtransClientKey = "SB-Mid-client-z9XIaQxpas1Y0Qfg";
      scriptTag.setAttribute("data-client-key", midtransClientKey);

      document.body.appendChild(scriptTag)

      return () => {
        document.body.removeChild(scriptTag)
      }
    }, [])
    

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", width: "90wh", p: 4 }}>
        <TextField type="text" label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{mb: 2}} />
        <TextField type="text" label="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} sx={{mb: 2}} />
        <TextField type="number" label="total" value={total} onChange={(e) => setTotal(e.target.value)} sx={{mb: 2}} />
        <Box>
            <Button onClick={process} variant='outlined'>
                Process
            </Button>
        </Box>
    </Box>
  )
}
