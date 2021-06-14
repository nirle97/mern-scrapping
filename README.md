# mern-scrapping

Full Stack application to scrape paste content every constant unit of time from the darknet using a `TOR` browser proxy.
the scrapping process is taking place using `puppeteer`:
every 40 seconds the puppteer launches and enters a specific website contains a temporery textual data.
With `socket.io` the gatherd text content is sent to the `express node` server and then to the `react` client page.
In parallel, the data is stored in `mongoDB`.

Client:
There is an alarm system to alert the user everytime a new information has arrived from the scrapper.
2 Charts are displayed in the dashboard in order to analyze the data:
  - i Number of pastes per hour: easy chart to monitor the activity time of the website
  - ii A sentiment score given to each paste according to the negativity of the paste's content.
There is a debounce search to easy navigate and find a specifc paste.

Docker:
There are 5 services running together in a docker-compose:
- client
- server
- mongodb
- scrapper
- tor proxy

Main Technologies:
`Nodejs, React, Express, MongoDB, Socket.io, Puppeteer, Docker-Compose`
