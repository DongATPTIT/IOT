const db = require('../database/database.service');

async function getListUser(){
  const rows = await db.query(
    `SELECT username,password FROM user`
  );
  return rows;
}
async function getDataSensor(){
    const data = await db.query(
        `SELECT device_id, humidity,temperature FROM iot.sensor;`
    );
    return data;
}

module.exports = {
    getListUser,getDataSensor
}