
#

## Serverless

---

### Serverless Secrets

* **We use Terraform scripts to upload encrypted secrets, but the instructions are provided anyway, for cases when we want to use Serverless instead (for simplicity)**

* Istall serverless secrets plugin:
  * `$ npm install --save-dev serverless-secrets-plugin`

* Encrypt and Decrypt secrets files (separated by environments):
  * DEV -> Decrpyt and Encrypt secrets.dev.yml.encrypted into secrets.dev.yml:
    * `$ serverless decrypt --stage dev --password 'some password'`

  * DEV -> Encrypt secrets.dev.yml into secrets.dev.yml.encrypted:
    * `$ serverless encrypt --stage dev --password 'some password'`

  * PROD:
    * `$ serverless decrypt --stage prod --password 'some other password'`
    * `$ serverless encrypt --stage prod --password 'some other password'`

* Deploy:
  * `$ AWS_PROFILE=serverless-admin sls deploy --stage dev -v`
    * Sample Output:
      * Service Information
        service: env-variables-encrypted-in-a-file
        stage: prod
        region: us-east-1
        stack: env-variables-encrypted-in-a-file-prod
        api keys:
          None
        endpoints:
          GET - <https://someid.execute-api.us-east-1.amazonaws.com/prod/resetpassword>
        functions:
          resetPassword: env-variables-encrypted-in-a-file-prod-resetPassword

  * **IMPORTANT NOTE**
    * **MAKE SURE ---> the unencrypted secrets files are listed in .gitignore or similar to make sure they are NEVER checked into your repository.**

### PROD Deployment
```bash
  Service Information
  service: epp-api
  stage: prod
  region: us-east-1
  stack: epp-api-prod
  api keys:
    prod-epp-rest-api-key: awsgeneratedapikey
  endpoints:
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/occupation
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/occupation/{id}
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/occupation/attribute/{id}
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/occupation/distance/{id}
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/synch-occupations
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/synch-skills
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/synch-abilities
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/redis/occupation
    GET - https://someid.execute-api.us-east-1.amazonaws.com/prod/redis/occupation/{id}
  functions:
    listoccupations: epp-api-prod-listoccupations
    getoccupation: epp-api-prod-getoccupation
    getoccupationattribute: epp-api-prod-getoccupationattribute
    getoccupationdistance: epp-api-prod-getoccupationdistance
    synchoccupations: epp-api-prod-synchoccupations
    synchskills: epp-api-prod-synchskills
    synchabilities: epp-api-prod-synchabilities
    dispatcher-occupations: epp-api-prod-dispatcher-occupations
    dispatcher-skills: epp-api-prod-dispatcher-skills
    dispatcher-abilities: epp-api-prod-dispatcher-abilities
    cron-synch: epp-api-prod-cron-synch
    listredis: epp-api-prod-listredis
    getdetails: epp-api-prod-getdetails
```
### Dev Deployment
```bash
Service Information
service: epp-api
stage: dev
region: us-east-1
stack: epp-api-dev
api keys:
  dev-epp-rest-api-key: awsgeneratedapikey
endpoints:
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/{id}
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/attribute/{id}
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/distance/{id}
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-occupations
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-skills
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-abilities
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/redis/occupation
  GET - https://someid.execute-api.us-east-1.amazonaws.com/dev/redis/occupation/{id}
functions:
  listoccupations: epp-api-dev-listoccupations
  getoccupation: epp-api-dev-getoccupation
  getoccupationattribute: epp-api-dev-getoccupationattribute
  getoccupationdistance: epp-api-dev-getoccupationdistance
  synchoccupations: epp-api-dev-synchoccupations
  synchskills: epp-api-dev-synchskills
  synchabilities: epp-api-dev-synchabilities
  dispatcher-occupations: epp-api-dev-dispatcher-occupations
  dispatcher-skills: epp-api-dev-dispatcher-skills
  dispatcher-abilities: epp-api-dev-dispatcher-abilities
  cron-synch: epp-api-dev-cron-synch
  listredis: epp-api-dev-listredis
  getdetails: epp-api-dev-getdetails
```

### Secret Values

Secrets will be encrypted by Terraform script, and a DevOps Engineer will provide the values to Dev Team to incorporate values into source code:

* db_username: AQICAHh8rnWmZx0di4Hv...(encrypted)
* db_password: AQICAHh8rnWmZx0di4Hv...(encrypted)
* db_host: AQICAHh8rnWmZx0di4Hv+VQx...(encrypted)
* db_name: AQICAHh8rnWmZx0di4Hv...(encrypted)
* redis_host: AQICAHh8rnWmZx0di4Hv...(encrypted)

---