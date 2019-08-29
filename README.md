# OCARIoT scripts
This repository contains useful scripts for use on the OCARIoT platform.

Following is a list of currently available scripts:

- Save children script

## Prerequisites
- [Node 8.0.0+](https://nodejs.org/en/download/)


## Set the environment variables
Scripts execution depends on the definition of three environment variables. To define them, make a copy of the `.env.example` file, naming for `.env`. After that, open and edit as needed.

Follows the definition of each variable:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `HOST` | The host from OCARIoT API Gateway.  | `https://localhost` |
| `ADMIN_USERNAME` | The default user name of type administrator of OCARIoT platform.| `admin` |
| `ADMIN_PASSWORD` | The default user password of the administrator of OCARIoT platform.  | `YOUR_PASSWORD` |


## Installation
#### 1. Install dependencies
```sh  
npm install    
```


## Save children script
Script responsible for retrieving child data from a CSV file and registering it on the OCARIoT platform.

To run the script it is necessary to have a CSV file with the children's data and know its path. This file must be in the format defined by the template **templates/template.save.children.csv**, where:

- The **username** column may contain the child's own username or email
- The **password** column must contain the password itself without exceptions.
- The **gender** column must contain the gender of the child (this field only accepts **male** or **female** as the value).
- The **age** column may contain the child's own age or date of birth which may be in Brazilian format (dd/mm/yyyy) or American format (yyyy/mm/dd).

It is also necessary have access to OCARIoT platform and the institution ID related to children.


### Execution
##### 1. Run Script
To execute the script just be in the root of the project and run the following command replacing CHILDREN_DATA_CSV_FILE_PATH and INSTITUTION_ID with the appropriate values:
```sh  
node scripts/save.children.js CHILDREN_DATA_CSV_FILE_PATH INSTITUTION_ID    
```

Or:
```sh  
npm run save.children CHILDREN_DATA_CSV_FILE_PATH INSTITUTION_ID 
```

Example:
```sh  
node scripts/save.children.js /my_home/children_data.csv 5a62be07de34500146d9c544 

or

npm run save.children /my_home/children_data.csv 5a62be07de34500146d9c544
```