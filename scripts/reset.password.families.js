const json2xls = require('json2xls')
const fs = require ('fs')
const https = require('https')
const axios = require('axios')
require('dotenv').config()

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

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

async function getFamilies(page, token) {
    return new Promise((resolve, reject) => {
        instance
            .get(
                `${process.env.HOST}/v1/families?page=${page}&limit=100`,
                {
                    headers: {'Authorization': 'Bearer ' + token}
                }
            )
            .then(res => resolve(res.data))
            .catch(err => reject(err.response.data))
    })
}

async function resetPasswordFamilies(families_arr, token) {
    let familiesOutput = []

    for (let i = 0; i < families_arr.length; i++) {
        try {
            const newPassword = generateRandomPassword()

            await instance
                .post(
                    `${process.env.HOST}/v1/users/${families_arr[i].id}/reset-password`,
                    { 'new_password': newPassword },
                    {
                        headers: {'Authorization': 'Bearer ' + token}
                    }
                )

            familiesOutput[i] = { 'family_username': families_arr[i].username,
                                  'family_password': newPassword,
                                  'family_child_username': families_arr[i].children[0].username
            }
        } catch (err) {
            console.log(err.response.data)
        }
    }

    return familiesOutput
}

function generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let randS = ''
    for (let i = 0; i < 6; i++) {
        randS += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return randS
}

async function init() {
    // Generate Admin Token
    const adminToken = await generateAdminToken()

    // Get all families
    let families = []
    for (let page = 1; page >= 1; page++) {
        const families_aux = await getFamilies(page, adminToken)
        if (!families_aux.length) break
        families = families.concat(families_aux)
    }

    // Reset the password for all families
    const familiesWithResetPassJson = await resetPasswordFamilies(families, adminToken)
    const families_output = json2xls(familiesWithResetPassJson)     // Convert to XLSX
    fs.writeFileSync('families_output.xlsx', families_output, 'binary') // Write output file
}

init()
