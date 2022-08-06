import axios from 'axios'
import gc from 'src/globalConfig'

const getAllUrl = gc.ip + '/api/customer/all'
const getByIdUrl = gc.ip + '/api/customer?id='
const getByQueryUrl = gc.ip + '/api/customer/query'
const addUrl = gc.ip + '/api/add-customer'
const editUrl = gc.ip + '/api/update-customer?id='
const deleteUrl = gc.ip + '/api/delete-customer'

class Customer {
    //Get Customers
    static getCustomers(filters) {
        let params = {}

        if (filters) {
            for (let prop in filters) {
                if (filters.hasOwnProperty(prop)) {
                    params[prop] = (filters[prop] + "").trim()
                }
            }
        }

        return new Promise(async (resolve, reject) => {
            try {
                // const res = await axios.get(url, {
                //     params: params
                // })
                
                const res = await axios.get(getAllUrl)
                const data = res.data
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    //Get Customer By Id
    static getCustomerById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${getByIdUrl}${id}`)
                const data = res.data
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    //Get Customer Data By Query String
    static getCustomerByQueryString(paramObj) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${getByQueryUrl}`, {
                    params: {
                        name: paramObj.name,
                        gender: paramObj.gender,
                        age: paramObj.age
                    }
                })
                console.log(res);
                const data = res.data
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    //Create Customer
    static insertCustomer(paramObj) {
        let data = {
            name: paramObj.name.trim(),
            gender: paramObj.gender.trim(),
            age: paramObj.age.trim()
        }
        return axios.post(addUrl, data)
    }

    //Update Customer
    static updateCustomer(paramObj) {
        let data = {
            name: paramObj.name.trim(),
            gender: paramObj.gender.trim(),
            age: paramObj.age
        }
        return axios.post(`${editUrl}${paramObj.id}`, data)
    }

    //Delete Customer
    static deleteCustomer(id) {
        let data = {
            id: id
        }
        return axios.post(deleteUrl, data)
    }
}

export default Customer