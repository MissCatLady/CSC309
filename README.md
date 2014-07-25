CSC309 A2
=========


Project Website: csc309findme.herokuapp.com

Detailed Description: goo.gl/WXkwzh

A2 Sprint Backlog: goo.gl/UzwAuG

Product Backlog: goo.gl/t6uNwi

[[Instructions]]

Database Setup:
> Skip this if using online server
> Database template is in main folder "findmedb.psql"
> Postgres is required to run 
> "createdb FINDMEDB" <-- creates a local db called FINDMEDB
> "psql -U USERNAME FINDMEDB < findmedb.pgsql" <-- use this command to import database template

Testing Login & Register:
> Register two different accounts
> Log-in with account A
> Use Logout on the footer to delete cookies

Testing Meeting & Friendlists:
> Open an incognito browser and log-in with account B
> Use A to request friendship with B's e-mail
> Go to Meet page on B, click "Meeting Places" on bottom navigation, accept request
> Go back to A to request a meeting
> Now on B accept request in "Meeting Places"
> Both users have access to same meet
> Any user may suggest a location under "Meeting Places"
> 60% or more votes for the place will decide the meeting spot

Testing Hide & Seek Game:
> Create an account C to test a third player, log out of account B
> Repeat friend addition and then accept meet in account C
> Go to Games and select Hide & Seek
> Players populated are only friends in meeting
> Click check in to get taken to the map page
> Chat on right hand is same as meeting chat
> Top left hand shows players that are hiders (not listed player is the seeker)
> Each person signs in and if the seeker is within 200m of a hider then the player is found
> Found hiders are crossed off
> The game is over when the seeker has found all players
> End game at the bottom of the screen deletes all game data
> Multiple games are possible per meeting and per person


Additional Notes:
> 
