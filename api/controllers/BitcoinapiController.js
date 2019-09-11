const bitcoin = require('bitcoinjs-lib');
const bitcore = require('bitcore');

const TestNet = bitcoin.networks.testnet;
let tx = new bitcoin.TransactionBuilder(TestNet);
let pushtx = require('blockchain.info/pushtx').usingNetwork(3) //remove .usingNetwork(3) for mainnet

const request = require('request');
module.exports = {
    
    createMainAccount : function(req,res){
                
        const keyPair = bitcoin.ECPair.makeRandom();
        let data = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        let privatekey = keyPair.toWIF();
        res.json({Address: data.address,"privatekey":privatekey});
    },

    createTestAccount : function(req,res){
       const keyPair = bitcoin.ECPair.makeRandom({ network: TestNet });
        let privatekey = keyPair.toWIF();
        let data  = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TestNet });
        res.json({Address: data.address,"privatekey":privatekey});
    },

    testBalance : function (req,res){
        
        let addr = req.body.address;
       
        request.get('https://api.blockcypher.com/v1/btc/test3/addrs/'+ addr +'/balance', (err, req, body) => {
            console.log((body))
            let data = JSON.parse(body);
            res.json({'Balance' :data.final_balance});
        });
          
    },

    mainBalance : function (req,res){
        
        let addr = req.body.address;
       
        request.get('https://api.blockcypher.com/v1/btc/main/addrs/'+ addr +'/balance', (err, req, body) => {
            console.log((body))
            let data = JSON.parse(body);
            res.json({'Balance' :data.final_balance});
        });
          
    },

    transaction : async(req,res)=>{
       
        let addr = req.body.address;
        let toAddress = req.body.toAddress;
        let amount =req.body.amount;
        let privatekey = req.body.privatekey;
        

        await request('https://api.blockcypher.com/v1/btc/test3/addrs/'+ addr +'/balance', (err, req, body) => {
            
            let result = JSON.parse(body);
            let balance = result.balance;
            console.log(balance);
            
            //getting unspent transaction output
            request('https://testnet.blockchain.info/unspent?active=' + addr, (err, req, body) => {
                //console.log(JSON.parse(body));
                result = JSON.parse(body);
                let i = result.unspent_outputs.length-1;
                utxo = {
                    "address":addr,
                    "txid": result.unspent_outputs[i].tx_hash_big_endian,
                    "vout":0,
                    "scriptPubKey":result.unspent_outputs[i].script,
                    "amount":result.unspent_outputs[i].value,
                    "satoshis":100000000,
                    //"height":1450760,
                    "confirmations":result.unspent_outputs[i].confirmations
                }
            
                // //creating raw transaction
                let fee = 1000;
                amountToKeep = balance-amount-fee;
                // key =bitcoin.ECPair.fromWIF(privatekey,TestNet);
                // tx.addInput(result.unspent_outputs[i].tx_hash_big_endian, 0);
                // //tx.addInput(result.unspent_outputs[i].tx_hash_big_endian, 1);
                // tx.addOutput(toAddress, amount)
                // tx.addOutput(addr, amountToKeep)
                // tx.sign(0, key)
                // let tx_hex = tx.build().toHex()
                // console.log(tx_hex);

                //generating transaction hex         
                    let rawtx = new bitcore.Transaction().from(utxo).to(toAddress, amount).to(addr, amountToKeep).sign(privatekey);
                   
                    let transaction = rawtx.serialize();
                    console.log('Transaction : '+  transaction);

                //broadcasting transaction
                let resp = pushtx.pushtx(transaction);
                res.send(resp);           
         
            });     
      
        });
      
    },

    swipe : async(req,res)=>{
       
        let addr = req.body.address;
        let toAddress = req.body.toAddress;
        //let amount =req.body.amount;
        let privatekey = req.body.privatekey;
        

        await request('https://api.blockcypher.com/v1/btc/test3/addrs/'+ addr +'/balance', (err, req, body) => {
            
            let result = JSON.parse(body);
            let balance = result.balance;
            console.log(balance);
            
            //getting unspent transaction output
            request('https://testnet.blockchain.info/unspent?active=' + addr, (err, req, body) => {
                //console.log(JSON.parse(body));
                result = JSON.parse(body);
                let i = result.unspent_outputs.length-1;
                utxo = {
                    "address":addr,
                    "txid": result.unspent_outputs[i].tx_hash_big_endian,
                    "vout":0,
                    "scriptPubKey":result.unspent_outputs[i].script,
                    "amount":result.unspent_outputs[i].value,
                    "satoshis":100000000,
                    //"height":1450760,
                    "confirmations":result.unspent_outputs[i].confirmations
                }
            
                // //creating raw transaction
                let fee = 1000;
                amount = balance-fee;
                // key =bitcoin.ECPair.fromWIF(privatekey,TestNet);
                // tx.addInput(result.unspent_outputs[i].tx_hash_big_endian, 0);
                // //tx.addInput(result.unspent_outputs[i].tx_hash_big_endian, 1);
                // tx.addOutput(toAddress, amount)
                // tx.addOutput(addr, amountToKeep)
                // tx.sign(0, key)
                // let tx_hex = tx.build().toHex()
                // console.log(tx_hex);

                //generating transaction hex         
                    let rawtx = new bitcore.Transaction().from(utxo).to(toAddress, amount).sign(privatekey);
                   
                    let transaction = rawtx.serialize();
                    console.log('Transaction : '+  transaction);

                //broadcasting transaction
                let resp = pushtx.pushtx(transaction);
                res.send(resp);           
         
            });     
      
        });
      
    },

    decodeTransaction : function(req,res){
        let rawtx = req.body.rawtx;
        request.post('https://api.blockcypher.com/v1/btc/test3/txs/decode',rawtx,function(err,resp,body){
            res.send(body);
        })
        
    },

    sendTransaction : function(req,res){

        let transaction = req.body.rawtx;

        //var pushtx = require('blockchain.info/pushtx')
        
        
        try{
            let resp = pushtx.pushtx(transaction);
            res.send(resp);
        }
        catch(err){
            res.send(err)
        }
        
       
    }

};

