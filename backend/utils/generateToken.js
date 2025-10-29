import jwt from 'jsonwebtoken'


    const token = jwt.sign(
      { status: "success", name, email, amount },
      process.env.JWT_SECRET,
      { expiresIn: "2m" }
    );


export default token