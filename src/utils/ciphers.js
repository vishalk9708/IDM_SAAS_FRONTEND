import CryptoJS from 'crypto-js';



var encryptionKey = '1kuv6kpqxz1kuv6k2pqxfknxyzieze1kuv6k2pqxzfko';

const encrypt = (myDataObj) => { 

    const myData = JSON.stringify(myDataObj);

    try{

        const enData  = CryptoJS.AES.encrypt(myData, encryptionKey).toString();
        //console.log("encrypted");
        return enData;
    }

    catch(err)
    { 
      //console.log(err)
    }
  
}

  const decrypt = (myData) => {

   

    try{
    var decryptedData =  CryptoJS.AES.decrypt(myData, encryptionKey);
  
    var decryptedDataParsed =  JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
   
    }
   
    catch(err)
    { 
      //console.log(err)
    }
  
    return decryptedDataParsed;
  }

export { encrypt, decrypt }