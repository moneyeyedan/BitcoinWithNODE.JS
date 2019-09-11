/**
 * BitcoinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// const Client = require('bitcoin-core');
// const client = new Client({ 
//   network: "142.93.51.57", 
//   username: 'masternoderpc', 
//   password: 'masternode', 
//   port: 8334 
// });

const request = require("request");
const base_url = 'http://masternoderpc:masternode@142.93.51.57:8334/';

//client.getBlockchainInfo().then((help) => console.log(help));
module.exports = {
   
    generateNewAddress : function(req,res){        
        let accountname = req.body.accountname;
        let options = { 
            method: 'POST',
            url: base_url,
            body: 
            {   jsonrpc: '1.0',
                id: 'curltest',
                method: 'getnewaddress',
                params: [ accountname ] 
            },
            json: true };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}
            
            res.send(body);
        });

    },

    getBalance : function(req,res){
        let accountname = req.body.accountname;
        let options = { 
            method: 'POST',
            url: base_url,
            body: 
            { jsonrpc: '1.0',
                id: 'curltest',
                method: 'getbalance',
                params: [ accountname ] 
            },
            json: true 
        };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}            
            res.send(body);
        });
    },

    dumpPrivateKey : function(req,res){

        let address = req.body.address;
        let options = { 
            method: 'POST',
            url: base_url,
            body:{   
                jsonrpc: '1.0',
                id: 'curltest',
                method: 'dumpprivkey',
                params: [ address ] 
            },
            json: true 
        };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}
            
            res.send(body);
        });

    },

    importPrivateKey : function(req,res){
       
        let privatekey = req.body.privatekey;
        let options = { 
            method: 'POST',
            url: base_url,
            body:
            {   
                jsonrpc: '1.0',
                id: 'curltest',
                method: 'importprivkey',
                params: [ privatekey ] 
            },
            json: true 
        };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}
            
            res.send(body);
        });    
    
    },

    getUnconfirmedBalance : function(req,res){
        let accountname = req.body.accountname;
        let options = { 
            method: 'POST',
            url: base_url,
            body: 
            { 
                jsonrpc: '1.0',
                id: 'curltest',
                method: 'getunconfirmedbalance',
                params: [ accountname ] 
            },
            json: true 
        };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}            
            res.send(body);
        });
    },

    transfer : function(req,res){
        let fromAccountName = req.body.fromAccountName;
        let toAddress = req.body.toAddress;
        let amount = req.body.amount;
        let options = { 
            method: 'POST',
            url: base_url,
            body: { 
                jsonrpc: '1.0',
                id: 'curltest',
                method: 'sendfrom',
                params: [fromAccountName,toAddress,amount]
            },
            json: true 
        };

        request(options, function (error, response, body) {
            if (error) {console.log(error);}            
            res.send(body);
        });
    }
    
};

