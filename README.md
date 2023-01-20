A simple site for visualizing user events. Input is json files with the
following format:

```
{ 
  "events": [
    { 
       "user_id": "<user_id>",
       "time": "<YYYY-MM-DDTHH:MM:SSZ>",
       "event_id": "<event_name>",
    }, {
       "user_id": "<user_id>",
       "time": "<YYYY-MM-DDTHH:MM:SSZ>",
       "user_state": "<state_name>",
    },
    ...
  ]
]
```

See the fake.json file for an example.

For now a state object must exist for each day that the user is in the given
state. 
       
The event list is stored in as a query parameter to make sharing easier.
However sufficiently large numbers of events or states may exceed maximum url
sizes. This is one (of a great many) areas for improvement.

Things to fix:
  *  Customize how states and/or events are displayed
  *  Allow picking time periods other than one day
  *  Allow selecting multiple events or states
  *  Consider reducing query parameter sizing by including only the information
     required to render the page, rather than the entire original json file.
