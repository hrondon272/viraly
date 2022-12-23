import "./App.css";
import { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Select from 'react-select'

import Stack from "@mui/material/Stack";

const limitesPagina = [
  {
    value: 5,
  },
  {
    value: 10,
  },
  {
    value: 15,
  },
  {
    value: 20,
  },
  {
    value: 25,
  },
];

const options = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '15', label: '15' },
  { value: '20', label: '20' },
  { value: '25', label: '25' }
]

function App() {
  //Variables de estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [numeroPaginas, setNumeroPaginas] = useState(1);
  const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
  const [devicesRequests, setDevicesRequests] = useState([]);
  const [token, setToken] = useState("");

  //Peticiones
  const login = () => {
    var data = JSON.stringify({
      "email": "gerencia@viraly.ai",
      "password": "CtAEaJbvt8TZ2wcS",
      "deviceId": "14dm1n"
    });
    
    var config = {
      method: 'post',
      url: 'https://api-staging.viraly.ai/users/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      setToken(response.data.data.userToken)
    })
    .catch(function (error) {
      console.log(error);
    });
    
  };

  const getDevices = () => {
    console.log('+++++++++++')
    var config = {
      method: 'get',
      url: `https://api-staging.viraly.ai/users/devices_requests?userId=ZsZrySuNxkGxxE8GsltsT&requestStatus=all&limit=${resultadosPorPagina}&page=${paginaActual}`,
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    };
    
    axios(config)
    .then(function (response) {
      setDevicesRequests(response.data.devicesRequests)
      setNumeroPaginas(response.data.totalPages) 
    })
    .catch(function (error) {
      console.log(error);
    });
  };   

  useEffect(() => {
    if (token != "") {
      getDevices()      
    }else{
      login()
    }
  }, [resultadosPorPagina, numeroPaginas, token, paginaActual]);  
      
  const handleChange = (event, value) => {
    setPaginaActual(value)
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <Typography variant="h2">Prueba técnica VIRALY</Typography>

      <Box sx={{
        m: 6
      }}>
            <Typography variant="body2">Seleccione la cantidad de registros a mostrar</Typography>
            <Select options={options} onChange={(elem)=>{setResultadosPorPagina(elem.value)}} deaultValue={options[0]} />
      </Box>
      
      <Grid container spacing={2} maxWidth={900}>
        {devicesRequests.map((value, index) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={value.avatarUrl}
                  alt={value.completeName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {value.completeName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {value.email}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {value.profileStatus}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    OS: {value.osName + " " + value.osVersion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    deviceId: {value.deviceId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phase: {value.phase}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ClientName: {value.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Device type: {value.isMobile == 1 ? "Mobile" : value.isDesktop == 1 ? "Desktop" : value.isOther == 1 ? "Other" : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Stack maxWidth={900} direction="row" spacing={10} sx={{ mt: 6 }}>
        <Pagination count={numeroPaginas} page={paginaActual} onChange={handleChange} />
      </Stack>
    </Box>
  );
}

export default App;
