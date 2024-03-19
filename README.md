# College BookMart Website

## Overview
The College BookMart Website is a platform designed to streamline the process of ordering stationery and printing documents for students. It provides an online solution for students to conveniently access essential resources without the need to visit external bookstores.

## Demo

Check demo/ for demo videos.

## Installation
To run the project locally, follow these steps:
1. Clone the repository to your local machine
```
git clone https://github.com/shuraih775/bookmart-website.git
```
2. Navigate to the project directory.
```
cd bookmart-website
```
3. Install dependencies using the package manager of your choice (e.g., npm or yarn).
```
#installing dependencies for the client side (considering you are at the root folder of project)

cd client
npm install

#installing dependencies for the server side (considering you are at the root folder of project)
cd server
npm install

#installing dependencies for the admin side (considering you are at the root folder of project)
cd server/admin
npm install

```
4. install MongoDB and create a database named 'bookmart_website' and add the following collections
 -users
 -uploadedfiles
 -products
 -orders
 -transactions

5. Run the project locally using the command.
```
#Starting client side (considering you are at the root folder of project)

cd client
npm start

#Starting server side (considering you are at the root folder of project)
cd server
npm install -g nodemon
nodemon server.js

#Starting admin side (considering you are at the root folder of project)
cd server/admin
npm start
```
#Important Note: Admin needs to be created manually. If you are directly entering a document in the users collection to create admin don't 
                 forget to hash the password before entering the document. Or else (easy way) just register the admin as regular user
                 and then go to your users collection edit the document and assign true to isAdmin.

## Usage
1. Register or log in to your account on the College Bookstore Website.
2. Navigate to the stationery ordering section to browse available products and add them to your cart.
3. Proceed to the checkout to place your order.
4. Upload documents for printing on the printing services page.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- React.js
- Node.js
- Express.js
- MongoDB

  
## Contributors

This project was built collaboratively by the following team members:

- Mohammed Uzair Obaid -> Contact - [uzairobaid.cs22@bmsce.ac.in](mailto:uzairobaid.cs22@bmsce.ac.in)
- Nakul Rajesh Dhole -> Contact - [rajeshdhole.cs22@bmsce.ac.in](mailto:rajeshdhole.cs22@bmsce.ac.in)
- Mohammed Yaseen Imam -> Contact - [yaseeniman.cs22@bmsce.ac.in](mailto:yaseeniman.cs22@bmsce.ac.in)
  
## Contact
For questions or feedback, feel free to contact the project maintainer at [shuraih15@gmail.com](mailto:shuraih15@gmail.com).
