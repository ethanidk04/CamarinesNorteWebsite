# Camarines Norte Tourism Website

## JUMP TO XAMPP SETUP BELOW FOR ACTIVE DB INSTANCE

**NOTE:** The website buttons and navigation will not work if you simply double-click the `index.html` file. This is due to browser CORS policies preventing a local file from opening other local files (like our separated JavaScript modules). 

To resolve this, you must run a local server first.

## Prerequisites (only do if running frontend w/o backend)
Make sure that you have **Node.js** installed. If you don't have it, look for installation guides according to your operating system at [nodejs.org](https://nodejs.org/) or any youtube guides

## How to Run Locally (only try if testing frontend, otherwise backend and db won't work)

1. Open your terminal or command prompt.
2. Navigate into the project folder.
3. Type the following command and hit Enter:
   ```bash
   npm start
4. If it didnt open the local server automatically,
   open your web browser and go to:
   http://localhost:8000
5. To terminate, press:
   ctrl + c


## XAMPP SETUP

Step 1: Install and Start XAMPP

Download and install XAMPP for Windows.

Open the XAMPP Control Panel.

Click Start next to both Apache and MySQL. Wait for them to turn green.

Step 2: Pull the Code into the Right Folder

Open File Explorer and navigate to C:\xampp\htdocs\

Open your terminal/command prompt inside that htdocs folder.

Clone or pull the latest repository so that the CamarinesNorteWebsite folder sits directly inside htdocs.
(Your path must be exactly: C:\xampp\htdocs\CamarinesNorteWebsite)

Step 3: Import the Database

Open your web browser and go to http://localhost/phpmyadmin/

Click Databases at the top.

Under "Create database", type exactly: camnorte_tourism and hit Create.

Click on your new camnorte_tourism database on the left sidebar.

Click the Import tab at the top.

Click Choose File and select the .sql file located right inside our CamarinesNorteWebsite folder.

Scroll down and click Import (or Go).

Step 4: View the Live Site

Open your browser and go to http://localhost/CamarinesNorteWebsite/

You can now test the "Book a Hotel" and "Plan Trip" forms. They will save directly to your local database and instantly appear on the "My Bookings" page!