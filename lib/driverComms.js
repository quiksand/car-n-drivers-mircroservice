const getDriverResponse = async driverInfo => {
  //they would say yes or no, but really they'll just always say yes
  //axios magic await the response but we'll be lazy and assume they want the ride
  return true;
};

const pollDrivers = async listOfCloseDrivers => {
  for (let i = 0; i < listOfCloseDrivers.length; i++) {
    let response = await getDriverResponse(listOfCloseDrivers[i]);
    if (response) {
      return listOfCloseDrivers[i];
    }
  }
  return null;
};

module.exports = {
  pollDrivers: pollDrivers
};