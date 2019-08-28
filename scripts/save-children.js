const csv = require('csvtojson')
const https = require('https')
const axios = require('axios')
require('dotenv').config()

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

const csvFilePath = `${process.env.CSV_FILE_PATH}`

function reverse(date) {
    const newDate = date.split('/').reverse()
    return newDate.join('-')
}

function getAgeFromBirthDate(birthDate) {
    const dateNow = new Date() // date now
    const yearNow = dateNow.getFullYear()
    const monthNow = dateNow.getMonth() + 1

    const dateBirth = new Date(birthDate) // birth date in Date format
    const yearBirth = dateBirth.getFullYear()
    const monthBirth = dateBirth.getMonth() + 1

    let age = yearNow - yearBirth
    if (monthNow < monthBirth) age--

    return age
}

async function csvToJSON(institution_id) {
    let children = await csv().fromFile(csvFilePath)

    // Removing data from children who will not be mapped
    children = children.filter(child => {
        return !(child.username.indexOf('#N/A') > -1)
    })

    // Handling username and age data
    children = children.map(child => {
        if (child.username.indexOf('@') > -1) {
            child.username = child.username.split('@')[0]
        }

        if (Number.isNaN(Number(child.age))) {
            if ((/^\d{1,2}[-|\/]\d{1,2}[-|\/]\d{4}$/i).test(child.age)) child.age = getAgeFromBirthDate(reverse(child.age))
            else {
                child.age = getAgeFromBirthDate(child.age)
            }
        }

        child.institution_id = institution_id           // Setting the institution
        return child
    })

    return children
}


function generateAdminToken() {
    return new Promise((resolve, reject) => {
        instance
            .post(
                `${process.env.HOST}/v1/auth`,
                {
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD
                })
            .then(res => resolve(res.data.access_token))
            .catch(err => reject(err))
    })

}

async function saveChild(child, token) {
    return new Promise((resolve, reject) => {
        instance
            .post(
                `${process.env.HOST}/v1/children`,
                child,
                {
                    headers: {'Authorization': 'Bearer ' + token}
                }
            )
            .then(res => resolve(res.data))
            .catch(err => reject(err.response.data))
    })
}

async function init() {
    const adminToken = await generateAdminToken()
    const children = await csvToJSON(`${process.env.INSTITUTION_ID}`)
    console.log('Number of children to be insert: ', children.length)
    let count = 0
    for (const child of children) {
        try {
            await saveChild(child, adminToken)
            console.log('Child saved:', child.username)
            count++
        } catch (err) {
            console.log(`Error at save the child ${child.username}:`, err)
        }
    }
    console.log('Number of inserted children: ', count)
}

init()
