import jwt from 'jsonwebtoken';

// wants to like a post
// clicks the like button => auth middleware -> (NEXT) => then we call the like controller... 

const auth = async (req, res, next) => {
    try {
        // we first verify the user by checking its token Id then we'll let do the actions 
        const token = req.headers.authorization.split(" ")[1]; // from client/api/index

        const isCustomAuth = token.length < 500; // here we are checking is the token of google auth's or our own 

        let decodedData; // this is the data that we want to get from the token itself

        if (token && isCustomAuth) {      
            decodedData = jwt.verify(token, 'test');
      
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token); // here we don't need to put the secret 
      
            req.userId = decodedData?.sub;  // google iD from which we can differentiate users 
        }    
      
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;

// now we use it in routes (like when someone likes a post then we want to use the middleware)