# API Endpoints

##

### List Occupations

***
Description: List Occupations
Data Source: Postgres
Date: Jan 4, 2019
***

https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation?per_page=3&page_number=1

Request: GET /occupation
Request: GET /occupation?per_page=20&page_number=1

#### Parameters

- None

- QueryParameter:
  - {per_page} (optional)
    - values: number of rows to be returned
    - default: return all rows
  - {page_number} (optional)
    - values: page number
    - default: return first page

#### Request body

- header: (**mandatory**)
  - x-api-key: (secret key)

#### Response (sample)

- HTTP/1.1 200 OK
- Content-Type: application/json

```JSON
{
  "command": "SELECT",
  "rowCount": 1110,
  "oid": null,
  "rows": [
    {
      "soc_code": "11-1011.00",
      "title": "Chief Executives"
    },
    {
      "soc_code": "11-1011.03",
      "title": "Chief Sustainability Officers"
    },
  ]
}
```

### Get Occupation

***
Description: Get Occupation Details
Data Source: Postgres
Date: Jan 4, 2019
***

https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/11-9041.01

Request: GET /occupation/{id}

#### Parameters

- {id} - soc_code

#### Request body

- header: (**mandatory**)
  - x-api-key: (secret key)

#### Response (sample)

- HTTP/1.1 200 OK
- Content-Type: application/json

```JSON
{
  "command": "SELECT",
  "rowCount": 1,
  "oid": null,
  "rows": [
    {
      "soc_code": "11-9041.01",
      "title": "Biofuels/Biodiesel Technology and Product Development Managers",
      "auto_risk": 0.123245,
      "salary_min": null,
      "salary_max": null,
      "description": "Define, plan, or execute biofuels/biodiesel research programs that evaluate alternative feedstock and process technologies with near-term commercial potential."
    }
  ],
  "fields": [
    {
      "name": "soc_code",
      "tableID": 16556,
      "columnID": 2,
      "dataTypeID": 1043,
      "dataTypeSize": -1,
      "dataTypeModifier": 104,
      "format": "text"
    },
    {
      "name": "title",
      "tableID": 16556,
      "columnID": 3,
      "dataTypeID": 1043,
      "dataTypeSize": -1,
      "dataTypeModifier": 504,
      "format": "text"
    },
    {
      "name": "auto_risk",
      "tableID": 16556,
      "columnID": 4,
      "dataTypeID": 700,
      "dataTypeSize": 4,
      "dataTypeModifier": -1,
      "format": "text"
    },
    {
      "name": "salary_min",
      "tableID": 16556,
      "columnID": 5,
      "dataTypeID": 23,
      "dataTypeSize": 4,
      "dataTypeModifier": -1,
      "format": "text"
    },
    {
      "name": "salary_max",
      "tableID": 16556,
      "columnID": 6,
      "dataTypeID": 23,
      "dataTypeSize": 4,
      "dataTypeModifier": -1,
      "format": "text"
    },
    {
      "name": "description",
      "tableID": 16556,
      "columnID": 7,
      "dataTypeID": 25,
      "dataTypeSize": -1,
      "dataTypeModifier": -1,
      "format": "text"
    }
  ],
  "_parsers": [
    null,
    null,
    null,
    null,
    null,
    null
  ],
  "RowCtor": null,
  "rowAsArray": false
}
```

### Get Occupation Attributes

***
Description: Get Occupation Attributes (Skills, Abilities, Education)
Data Source: Postgres
Date: Jan 4, 2019
***

https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/attribute/11-9041.01
Request: GET /occupation/attribute/{id}

#### Parameters

- {id} - soc_code

#### Request body

- header: (**mandatory**)
  - x-api-key: (secret key)

#### Response (sample)

- HTTP/1.1 200 OK
- Content-Type: application/json

Stripped down response sample:

```JSON
{
  "ability": {
    "count": 52,
    "data": {
      "command": "SELECT",
      "rowCount": 52,
      "oid": null,
      "rows": [
        {
          "soc_code": "11-9041.01",
          "attr_id": "1.A.1.a.2",
          "attr_name": "Written Comprehension",
          "attr_level": 4.25,
          "attr_importance": 4
        },
      ],
    }
  },
  "skill": {
    "count": 35,
    "data": {
      "command": "SELECT",
      "rowCount": 35,
      "oid": null,
      "rows": [
        {
          "soc_code": "11-9041.01",
          "attr_id": "2.A.1.a",
          "attr_name": "Reading Comprehension",
          "attr_level": 4.25,
          "attr_importance": 3.62
        },
      ],
    }
  },
  "education": {
    "count": 12,
    "data": {
      "command": "SELECT",
      "rowCount": 12,
      "oid": null,
      "rows": [
        {
          "soc_code": "11-9041.01",
          "cat": 1,
          "cat_description": "Less than a High School Diploma",
          "percentage": 0
        },
        {
          "soc_code": "11-9041.01",
          "cat": 2,
          "cat_description": "High School Diploma - or the equivalent (for example, GED)",
          "percentage": 1
        },
      ],
    }
  }
}
```

### Get Occupation Distances

***
Description: Get Occupation Distances
Data Source: Postgres
Date: Jan 4, 2019
***

[https://someid.execute-api.us-east-1.amazonaws.com/dev/occupation/distance/33-3021.01?rows_limit=4&soc_exclude=33-3021.03,33-3051.01,33-3051.03,33-1012.00

Request: GET /distance/{id}
Request: GET /distance/33-3021.01
Request: GET /distance/33-3021.01?rows_limit=4&soc_exclude=33-3021.03,33-3051.01,33-3051.03,33-1012.00

#### Parameters

- {id} - soc_code

- QueryParameter:
  - {rows_limit} (optional)
    - values: number of rows to be returned, default: 10
  - {soc_exclude} (optional)
    - values: exclude listed occupations from a result set - used to avoid returning already visited pathways.

#### Request body

- header: (**mandatory**)
  - x-api-key: (secret key)

#### Response (sample)

- HTTP/1.1 200 OK
- Content-Type: application/json

```JSON
{
  "overlap": {
    "count": 4,
    "data": {
      "command": "SELECT",
      "rowCount": 4,
      "oid": null,
      "rows": [
        {
          "soc_code": "11-9199.07",
          "title": "Security Managers",
          "description": "Direct an organization's security functions, including physical security and safety of employees, facilities, and assets.",
          "risk_start": "0.0602424",
          "risk_end": "0.060856",
          "salarymax_start": 99317,
          "salarymax_end": null,
          "dist_all": "1.81412527136974"
        },
        {
          "soc_code": "13-1041.06",
          "title": "Coroners",
          "description": "Direct activities such as autopsies, pathological and toxicological analyses, and inquests relating to the investigation of deaths occurring within a legal jurisdiction to determine cause of death or to fix responsibility for accidental, violent, or unexplained deaths.",
          "risk_start": "0.0602424",
          "risk_end": "0.0817659",
          "salarymax_start": 99317,
          "salarymax_end": 60942,
          "dist_all": "1.83447104571217"
        },
        {
          "soc_code": "33-3052.00",
          "title": "Transit and Railroad Police",
          "description": "Protect and police railroad and transit property, employees, or passengers.",
          "risk_start": "0.0602424",
          "risk_end": "0.11967",
          "salarymax_start": 99317,
          "salarymax_end": 99317,
          "dist_all": "1.84686457234796"
        },
        {
          "soc_code": "29-1122.00",
          "title": "Occupational Therapists",
          "description": "Assess, plan, organize, and participate in rehabilitative programs that help build or restore vocational, homemaking, and daily living skills, as well as general independence, to persons with disabilities or developmental delays.",
          "risk_start": "0.0602424",
          "risk_end": "0.0564015",
          "salarymax_start": 99317,
          "salarymax_end": 62556,
          "dist_all": "1.97393243665018"
        }
      ],

    }
  }
}
```

### Warm-up CRON job - (currently runs every 30 minutes)

***
Description: Every 30 minutes CRON job automatically gets activated in order to send a message to SNS topic "mars-epp-dev-warm". There are 4 subscribers to that topic, which get triggered when a message arrives:

- arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-list
- arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ
- arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ-dist
- arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ-attr

Date: Mar 4, 2019
***

```python

  cron-warm:
    handler: scheduler/warmup-lambdas.warm
    timeout: 60
    events:
      - schedule: rate(30 minutes) # run every 30 minutes
  ```

### Warm-up List Occupations function

***
**Description:** Warm-up List Occupations (epp-api-dev-dispatcher-warm-list) gets triggered when a message arrives to SNS topic "mars-epp-dev-warm".

**Date:** Mar 4, 2019

**Arn:** arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-list
***

https://us-east-1.console.aws.amazon.com/sns/v2/home?region=us-east-1#/topics/arn:aws:sns:us-east-1:awsaccountid:mars-epp-dev-warm

#### Request (function to function)

- lambda.invoke: listoccupations
- Payload: '{"queryStringParameters": { "per_page" : "1", "page_number": "1" }}'

### Warm-up Get Occupation function

***
**Description:** Warm-up Get Occupation (epp-api-dev-dispatcher-warm-get-occ) gets triggered when a message arrives to SNS topic "mars-epp-dev-warm".

**Date:** Mar 4, 2019

**Arn:** arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ
***

https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/epp-api-dev-dispatcher-warm-get-occ

#### Call getoccupation (function to function)

- lambda.invoke: getoccupation
- Payload: '{"pathParameters": { "id": "11-1011.00" }}'

### Warm-up Get Occupation Distance function

***
**Description:** Warm-up Get Occupation Distance (epp-api-dev-dispatcher-warm-get-occ-dist) gets triggered when a message arrives to SNS topic "mars-epp-dev-warm".

**Date:** Mar 4, 2019

**Arn:** arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ-dist
***

[https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/epp-api-dev-dispatcher-warm-get-occ-dist

#### Call getoccupationdistance (function to function)

- lambda.invoke: getoccupationdistance
- Payload: Payload: '{"pathParameters": { "id": "11-1011.00" },"queryStringParameters": { "rows_limit" : "1" }}'

### Warm-up Get Occupation Attributes (Skills, Abilities, Education) function

***
 **Description:** Warm-up Get Occupation Attributes(epp-api-dev-dispatcher-warm-get-occ-attr) gets triggered when a message arrives to SNS topic "mars-epp-dev-warm".

**Date:** Mar 4, 2019

**Arn:** arn:aws:lambda:us-east-1:awsaccountid:function:epp-api-dev-dispatcher-warm-get-occ-attr
***

https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/epp-api-dev-dispatcher-warm-get-occ-attr

#### Call getoccupationattribute (function to function)

- lambda.invoke: getoccupationattribute
- Payload: '{"pathParameters": { "id": "11-1011.00" }}'

### Redis: Synch Skills per Occupation

***
**Description:** Synch Skills per Occupation

**Data Source:** Postgres

**Date:** Jan 4, 2019
***

Request: GET /synch-skills

#### Parameters

- none

#### Request body

(empty)

#### Response (sample)

HTTP/1.1 200 OK
Content-Type: application/json

```JSON
{
  "res": "ok",
  "count": 33810
}
```

sample call:

- https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-skills

***
**Description:** Synch Occupations

**Data Source:** Redis

**Date:** Jan 16, 2019
***

Request: GET /synch-occupations

Parameters:
  none

Request body: (empty)

Response body:

HTTP/1.1 200 OK
Content-Type: application/json

```JSON
{
  "res": "ok",
  "count": 1110
}
```

sample call:

- https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-occupations

***
**Description:** Synch Abilities per Occupation

**Data Source:** Redis

**Date:** Jan 16, 2019
***

Request: GET /synch-abilities

Parameters:

- none

Request body: (empty)

Response body:

HTTP/1.1 200 OK
Content-Type: application/json

```JSON
{
  "res": "ok",
  "count": 50232
}
```

sample call:

- https://someid.execute-api.us-east-1.amazonaws.com/dev/synch-abilities