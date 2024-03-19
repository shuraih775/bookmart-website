const User = require('../models/users');
const { token, secretKey } = require('./auth');
const jwt = require('jsonwebtoken');


const getUsernameById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            return user.username; 
        } else {
            return null; 
        }
    } catch (error) {
        console.error(error);
        return null; 
    }
};


const getUsername = async (token) => {
    try {
        
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

       
        const username = await getUsernameById(userId);
        return username; 
    } catch (error) {
        console.error('Token verification failed:', error);
        return null; 
}
};

const fetch = {
    fetchUsername:async(req,res)=>{
        try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'User not logged in' });
        }
  
        const tokenArray = authHeader.split(' ');
        const token = tokenArray[1];
        
        if (!token) {
          return res.status(401).json({ message: 'User not logged in' });
        }
  
        const username = await getUsername(token);
        console.log(username);
        if (!username) {
          return res.status(401).json({ message: 'Invalid token' });
        }
        res.json({username});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : 'Internal Server Error'});
    }
}
};

module.exports = { fetch,getUsername };
