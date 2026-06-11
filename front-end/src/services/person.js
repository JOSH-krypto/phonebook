import axios from 'axios';
const BASE_URL= 'http://localhost:3001/api/persons'

const getAll =()=>{
    return axios.get(BASE_URL)
}
const create = newObject =>{
   return axios.post(BASE_URL, newObject)
}
const update = (id, newObject) =>{
    return axios.put(`${BASE_URL}/${id}`, newObject)
}
const deleteContact = id =>{
    return axios.delete(`${BASE_URL}/${id}`)
}

export default {getAll, create,update, deleteContact}