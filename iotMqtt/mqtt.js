const mqtt = require('mqtt');
const {
    getDevices,
  } = require('../controllers/device');

onMessage=(topic,message)=>
{
console.log(message);
};


createTopic=(deviceType,deviceId,func)=>{
    const topic=process.env.MQTT_ROOT_TOPIC+"/0001"+"/"+deviceId+"/"+func;
    return topic;
}

onConnect=async()=>
{
console.log("Mqtt Connected");
const devices=await getDevices();
devices.forEach((device) => {
    
    const topic=createTopic(device.deviceType,device.deviceId,"STATUS");
    console.log(topic);
    //client.subscribe(topic);

});
};

exports.mqtt_connection= (topic)=>
{
   const client=mqtt.connect(process.env.MQTT_URI); 
    client.subscribe("ELMASTEK/0001/023747113534/STATUS");
   // client.on('connect', onConnect);
	client.on('message', onMessage);
}