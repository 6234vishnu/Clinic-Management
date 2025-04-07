import bcrypt from 'bcrypt';

const hashPassword = async (plainPassword) => {
  const saltRounds = 10; // You can adjust this for stronger hashing
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export default hashPassword;
