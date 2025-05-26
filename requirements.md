# **Project Requirements Document: The Worst Movie**

### The following table outlines the detailed functional requirements of The Worst Movie.

| Requirement ID | Description | User Story | Expected Behavior/Outcome |
|----------------|-------------|------------|---------------------------|
| FR001 | Upload .csv file   | As a user, I want to be able to upload .csv file with a list of movie. | The system should provide a POST /v1/movies method to upload file, with swagger documentation. |
| FR002 | Save movies on Sqlite Database | As a user, I want to be able to after upload .csv file save all data in a databse | The system should be able to connect in database, validate fields and save on Sqlite database using TypeORM. |
| FR003 | List all movies saved on database | As a user, I want to list all movies from database. | The system should be provide an endpoint GET /v1/movies to list movies from database. |
| FR004 | Edit a movie saved on database | As a user, I want to be able to edit some register on database. | The system should be provide an endpoint PUT /v1/movies/:id to edit register on database. |
| FR005 | Delete movie saved on database | As a user, I want to be able to delete a movie from database. | The system should be provide an endpoint DEL /v1/movies/:id to edit register on database. |
| FR006 | Show Awards Interval | As a user, I want be able to visualise an awards interval. | The system should be provide an endpoint GET /v1/movies/awards to show awards interval based on example from requirement ID PYLD002. |
| FR007 | Validate all fields from .csv file | As user, I want to ensure data integrity from .csv file | The system should be apply validation rules in .csv files using Joi as DTO to ensure data integrity. |


### The following table outlines the detailed nonfunctional requirements of The Worst Movie.

| Requirement ID | Description |
|----------------|-------------|
| NFR001 | API RESTful should be implemented with level two Richardson maturity. |
| NFR002 | API should be implemented just end-to-end testing. It should be ensure data integrity. Use Jest. |
| NFR003 | Database should be in memory, in this case use SQLite3. |
| NFR004 | All endpoints should be documented on swagger. |
| NFR005 | The application should have detailed readme with instructions to run the applicatio and e2e tests. |

### Database fields
| Field | Type | Size | Required |
|-------|------|------|----------|
| ID | Number | 10 | true |
| year | Number | 4 | true |
| title | string | 255 | true |
| studios | string | 255 | true |
| producers | string | 255 | true |
| winner | boolean | - | false |

### PYLD001 - Income data from .csv file.
```
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
1980;The Formula;MGM, United Artists;Steve Shagan;
1980;Friday the 13th;Paramount Pictures;Sean S. Cunningham;
1980;The Nude Bomb;Universal Studios;Jennings Lang;
1980;The Jazz Singer;Associated Film Distribution;Jerry Leider;
1980;Raise the Titanic;Associated Film Distribution;William Frye;
1980;Saturn 3;Associated Film Distribution;Stanley Donen;
1980;Windows;United Artists;Mike Lobell;
1980;Xanadu;Universal Studios;Lawrence Gordon;
1981;Mommie Dearest;Paramount Pictures;Frank Yablans;yes
1981;Endless Love;Universal Studios, PolyGram;Dyson Lovell;
1981;Heaven's Gate;United Artists;Joann Carelli;
1981;The Legend of the Lone Ranger;Universal Studios, Associated Film Distribution;Walter Coblenz;
1981;Tarzan, the Ape Man;MGM, United Artists;John Derek;
1982;Inchon;MGM;Mitsuharu Ishii;yes
```

### PYLD002 - Output to endpoint GET /v1/movie/awards.
```
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    },
    {
      "producer": "Producer 2",
      "interval": 1,
      "previousWin": 2018,
      "followingWin": 2019
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    },
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}
```





