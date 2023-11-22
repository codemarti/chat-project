import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

interface User { id: string; username: string; ip: string; }
interface UsuariosProps {
  socketToConnect: any; // Reemplaza 'any' con el tipo correcto de socketToConnect 
} const Usuarios: React.FC<UsuariosProps> = ({ socketToConnect }) => {
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]); useEffect(() => {
    // Configurar socket para recibir la lista de usuarios conectados
    if (socketToConnect) { socketToConnect.on('connected-users', (users: User[]) => { setConnectedUsers(users); }); // Limpiar el efecto al desmontar el componente
    return () => { socketToConnect.off('connected-users'); }; } }, [socketToConnect]); return ( <> <h1>Usuarios Conectados</h1> <TableContainer component={Paper}> <Table sx={{ minWidth: 450 }} aria-label="simple table"> <TableHead> <TableRow> <TableCell>Username</TableCell> <TableCell align="right">IP Address</TableCell> </TableRow> </TableHead> <TableBody> {connectedUsers.map((user) => ( <TableRow key={user.id}> <TableCell component="th" scope="row">{user.username}</TableCell> <TableCell align="right">{user.ip}</TableCell> </TableRow> ))} </TableBody> </Table> </TableContainer> </> ); }; export default Usuarios;