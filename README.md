# Save children Script  
Script responsible for retrieving child data from a CSV file and registering it on the OCARIoT platform.


## Prerequisites
- [Node 8.0.0+](https://nodejs.org/en/download/)
- Have a CSV file with children's data 
- Have access to OCARIoT platform and the institution id related to children

---


## Set the environment variables
Script execution depends on the definition of three environment variables. To define them, make a copy of the `.env.example` file, naming for `.env`. After that, open and edit as needed. Follows the definition of each variable:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `HOST` | The host from OCARIoT API Gateway.  | `https://localhost` |
| `ADMIN_USERNAME` | The default user name of type administrator of OCARIoT platform.| `admin` |
| `ADMIN_PASSWORD` | The default user password of the administrator of OCARIoT platform.  | `YOUR_PASSWORD` |


## Installation and Execution
#### 1. Install dependencies  
```sh  
npm install    
```
 
#### 2. Run Script  
To execute the script just be in the root of the project and run the following command replacing CHILDREN_DATA_CSV_FILE_PATH and INSTITUTION_ID with the appropriate values.:  
```sh  
node scripts/save.children.js CHILDREN_DATA_CSV_FILE_PATH INSTITUTION_ID    
```

Or:
```sh  
npm run save.children CHILDREN_DATA_CSV_FILE_PATH INSTITUTION_ID 
```

Example: 
```sh  
node scripts/save.children.js /my_home/children_CSV.csv 5a62be07de34500146d9c544 

or

npm run save.children /my_home/children_CSV.csv 5a62be07de34500146d9c544
```