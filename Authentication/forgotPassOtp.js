const otpGen = require("otp-generator");
const crypto = require("crypto");
const config = require("../configuration.json");
const key = config.OTP_KEY;

const FORGOT_PASSWORD = "forgot_password";
const RESET = "reset";

const createNewOTP = (phone) => {
  // Generate a 6 digit numeric OTP
  const otp = otpGen.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000; //5 Minutes in milliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${FORGOT_PASSWORD}.${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);
  return fullHash;
};

function sendSMS(phone, message) {
  let recepient = phone;
  console.log(`Message to ${recepient}: ${message} [Reset password]`);
}

const verifyOTP = (phone, hash, otp) => {
  // Seperate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return false;
  // Calculate new hash with the same key and the same algorithm
  let data = `${FORGOT_PASSWORD}.${phone}.${otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return true;
  }
  return false;
};

const createResetToken = (role, reg_id) => {
  // Generate a 6 digit numeric OTP

  const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${RESET}.${role}.${reg_id}.success.${expires}`; // expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  return fullHash;
};

const verifyResetToken = (role, reg_id, hash) => {
  // Seperate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return false;
  // Calculate new hash with the same key and the same algorithm
  let data = `${RESET}.${role}.${reg_id}.success.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return true;
  }
  return false;
};

module.exports = {
  createNewOTP,
  verifyOTP,
  createResetToken,
  verifyResetToken,
};
