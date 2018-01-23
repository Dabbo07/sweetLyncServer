const cryptKey = "123ABC";

var CryptoJS = require("crypto-js");

var EncryptionService = function() {};

EncryptionService.prototype.encryptText = function(text) {
    var salt = CryptoJS.lib.WordArray.random(128/8);
	var iv = CryptoJS.lib.WordArray.random(128/8);

    var daz = text.hello.world;

    var key = CryptoJS.PBKDF2(
		cryptKey,
		salt, 
		{
            keySize: 256/32, 
            iterations: 1000 
        }
    );
    console.log("Using Encryption Key: " + key);
    var encrypted = CryptoJS.AES.encrypt(
		text,
        key, 
        { 
            iv: iv, 
		    mode: CryptoJS.mode.CBC, 
			padding: CryptoJS.pad.Pkcs7 
		}
	);
	return (iv + "{a-" + salt + "{a-" + encrypted.ciphertext);
};

EncryptionService.prototype.decryptText = function(text) {
    var decrypted = "";
    if (text === undefined || text === null) {
        console.log("ERROR: Invalid text for decryption.");
        return "";
    };
    var data = text.split("{a-");
    if (data.length != 3) {
        console.log("ERROR: Invalid text for decryption.");
        return "";
    };
    var key = CryptoJS.PBKDF2(
        cryptKey,
        CryptoJS.enc.Hex.parse(data[1]),
        {
            keySize: 256/32, 
            iterations: 1000 
        }
    );
   
    var iv = CryptoJS.enc.Hex.parse(data[0]);
    var cipher = CryptoJS.lib.CipherParams.create({
        key : key,
        iv : iv,
        ciphertext : CryptoJS.enc.Hex.parse(data[2])
    });
               
    decrypted += CryptoJS.AES.decrypt(
        cipher, 
        key, 
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,  
            padding: CryptoJS.pad.Pkcs7 
        }
    ).toString(CryptoJS.enc.Utf8);
   
    return decrypted;
};     

EncryptionService.prototype.log = function() {
    console.log('Encryption service available.');
};

exports.EncryptionService = new EncryptionService();

