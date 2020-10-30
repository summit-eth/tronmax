'use strict';


const ABI =
[
	{
		"constant": true,
		"inputs": [],
		"name": "contractInfo",
		"outputs": [
			{
				"name": "_invested",
				"type": "uint256"
			},
			{
				"name": "_investors",
				"type": "uint256"
			},
			{
				"name": "_referBonus",
				"type": "uint256"
			},
			{
				"name": "_withdrawn",
				"type": "uint256"
			},
			{
				"name": "_depositCount",
				"type": "uint256"
			},
			{
				"name": "_contractStartTime",
				"type": "uint256"
			},
			{
				"name": "_contractIniTime",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "userPlanInfo",
		"outputs": [
			{
				"name": "_depositCount",
				"type": "uint256"
			},
			{
				"name": "_activeDeposit",
				"type": "uint256"
			},
			{
				"name": "_reinvestCount",
				"type": "uint256"
			},
			{
				"name": "_dividends",
				"type": "uint256"
			},
			{
				"name": "_tarifN",
				"type": "uint256"
			},
			{
				"name": "_tarifB",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "userGeneralInfo",
		"outputs": [
			{
				"name": "_referBonus",
				"type": "uint256"
			},
			{
				"name": "_cbackBonus",
				"type": "uint256"
			},
			{
				"name": "_totalDeposited",
				"type": "uint256"
			},
			{
				"name": "_totalWithdrawn",
				"type": "uint256"
			},
			{
				"name": "_totalReinvested",
				"type": "uint256"
			},
			{
				"name": "_totalReferBonus",
				"type": "uint256"
			},
			{
				"name": "_refLevel1",
				"type": "uint256"
			},
			{
				"name": "_refLevel2",
				"type": "uint256"
			},
			{
				"name": "_structure",
				"type": "uint256[3]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_upline",
				"type": "address"
			}
		],
		"name": "deposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "reinvest",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "upline",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "bonus",
				"type": "uint256"
			}
		],
		"name": "Upline",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "NewDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "MatchPayout",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	}
];

var contract = null;

var VueTRON = {
    data() {
        return {
            tron: {	
                tronWeb: false,
                auth: false,
                account: ''
            },	
            contract: {
				wallet: contractWallet,
                invested: 0,
				investors: 0,				               				
                refer_bonus: 0,			
				contract_StartDate: 0,
                contract_IniTime: 0, 			
				
				startD: 0,
				startH: 0,
				startM: 0,
				startS: 0,
				upIniTime: 0
				
            },
            upline: 'TJFh8yMdcZBwfH6tcyDuLe8jxebSAXb1ZU'
        };
    },
    created() {
        let self = this,
            tries = 0;

        setTimeout(function initTimer() {
            if(!window.tronWeb) return ++tries < 50 ? setTimeout(initTimer, 100) : null;

            self.tron.tronWeb = !!window.tronWeb;

            window.tronWeb.on('addressChanged', function() {
                self.tron.account = window.tronWeb.defaultAddress.base58;
            });

            setTimeout(function chechAuth() {
                self.tron.auth = window.tronWeb && window.tronWeb.ready;
                if(!self.tron.auth) setTimeout(chechAuth, 200);
                else self.tron.account = window.tronWeb.defaultAddress.base58;

                app.checkState()
            }, 200);

            setInterval(() => {
                app.checkState()
            }, 3000)

        }, 100);
    },
    methods: {
        getTronWeb() {
            return new Promise((resolve, reject) => {
                window.tronWeb ? resolve(window.tronWeb) : reject('TronWeb not found');
            });
        },
        getBalancePlayer () {

            this.getTronWeb().then(tronWeb => {
                tronWeb.trx.getBalance(tronWeb.defaultAddress.base58)
                    .then( data => {
                        this.player.wallet.balance = Math.round(data / 1000000 * 100) / 100
                    } )
            })
        },  
		
        getContract () {

            if (contract) {
                return
            }
            
            this.getTronWeb()
            .then(tronWeb => {
                contract = tronWeb.contract(ABI, tronWeb.address.toHex(this.contract.wallet));
            })
            .catch(err => {
                console.log(err)
            })
        },
        checkState () {
            this.tron.auth = window.tronWeb && window.tronWeb.ready
            this.getContract()
            this.getContractInfo()
            this.getUserInfo()
            this.getBalancePlayer()
        },
        deposit(amount) {
			  this.deposit_I(amount) 
        },
        deposit_I (amount) {
            //alert('Investments will be enabled at the end of the timer')
            //return
            amount = parseFloat(amount) || 0;
            if(amount >= 30) {
                this.getTronWeb().then(tronWeb => {                    
                    contract.deposit(this.upline).send({
                        callValue: tronWeb.toSun(amount),
                        shouldPollResponse: true
                    }).then(res => {
                        this.getUserInfo();
                        this.callInvesmentsPlayer = true;   
						//this.notice('Transaction successful', '4caf50')
                    })
                    .catch(err => {
                        console.log(err)
                    })
                });
            } else {
				//this.notice('Amount must be greater than or equal to 100 TRX', 'fb8c00')			
			}
        },		
        getUserInfo() {
            this.getTronWeb().then(tronWeb => {

                tronWeb.trx.getBalance(this.tron.account).then(res => {
                    if (this.user != undefined) {
                        this.user.trx = parseFloat(tronWeb.fromSun(res));
                    }
                });  				
				
                if(contract) {
                    contract.userGeneralInfo(this.tron.account).call().then(res => {                     
                        this.player.total_deposited = Math.round(parseFloat(tronWeb.fromSun(res._totalDeposited)*100)) / 100;
						this.player.total_reinvested = Math.round(parseFloat(tronWeb.fromSun(res._totalReinvested)*100)) / 100;	
						this.player.total_withdrawn = Math.round(parseFloat(tronWeb.fromSun(res._totalWithdrawn)*100)) / 100;
						this.player.total_refer_bonus = Math.round(parseFloat(tronWeb.fromSun(res._totalReferBonus)*100)) / 100;						
						this.player.refer_bonus = Math.round(parseFloat(tronWeb.fromSun(res._referBonus)*100)) / 100;
						this.player.cback_bonus = Math.round(parseFloat(tronWeb.fromSun(res._cbackBonus)*100)) / 100;	
						this.player.refLevel1 = parseInt(res._refLevel1);
						this.player.refLevel2 = parseInt(res._refLevel2);
                        this.player.referrals = res.structure;
                    })
                    .catch(err => {
                        console.log(err)
                    })                    
                }; 
				
	            if(contract) {
                    contract.userPlanInfo(this.tron.account).call().then(res => {
                        this.player.deposits_count = Math.round(parseFloat(tronWeb.fromSun(res._depositCount)*100)) / 100;
						this.player.active_deposit = Math.round(parseFloat(tronWeb.fromSun(res._activeDeposit)*100)) / 100;
						this.player.reinvest_count = parseInt(res._reinvestCount);
						this.player.dividends = Math.round(parseFloat(tronWeb.fromSun(res._dividends)*100)) / 100;
						this.player.tarifN = Math.round(parseFloat(tronWeb.fromSun(res._tarifN/1000)*100)) / 100;
						this.player.tarifB = Math.round(parseFloat(tronWeb.fromSun(res._tarifB/1000)*1000)) / 1000;							
						this.player.allDivs = Math.round((this.player.dividends + this.player.refer_bonus + this.player.cback_bonus)*100)/100;
                    })
                    .catch(err => {
                        console.log(err)
                    })                    
                }
				
            });
        },
        getContractInfo() {
            this.getTronWeb().then(tronWeb => {
                if(contract) {
                    contract.contractInfo().call().then(res => {
                        this.contract.invested = Math.round(parseFloat(tronWeb.fromSun(res._invested))*100)/100;
                        this.contract.investors = parseInt(res._investors);
                        this.contract.refer_bonus = Math.round(parseFloat(tronWeb.fromSun(res._referBonus))*100)/100;              						
						this.contract.contract_StartDate = parseInt(res._contractStartTime);                       
						this.contract.contract_IniTime = parseInt(res._contractIniTime);
						this.getContractStartTime (); 
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
        },
		
        getContractStartTime () {   		
            let t1 = new Date(1000 + this.contract.contract_IniTime * 1000)	
			let t2 = new Date(1000 + 0)
            this.restTimeDHMS(t1, t2)            
        },
		
        restTimeDHMS(tMax, tMin) {
            let t_Max = tMax.getTime()
            let t_Min = tMin.getTime()

            let t_Dif = t_Max - t_Min

            if (t_Dif <= 0) {               
               this.contract.startD = 0
			   this.contract.startH = 0
			   this.contract.startM = 0
			   this.contract.startD = 0
            }
			
            let days = parseInt(t_Dif / 1000 / 60 / 60 / 24)
            t_Dif -= days * 24 * 60 * 60 * 1000		
			this.contract.startD = days

            let hours = parseInt(t_Dif / 1000 / 60 / 60)
            t_Dif -= hours * 60 * 60 * 1000
			this.contract.startH = hours

            let minutes = parseInt(t_Dif / 1000 / 60)
            t_Dif -= (minutes * 60 * 1000)
			this.contract.startM = minutes

            let seconds = parseInt(t_Dif / 1000)
			this.contract.startS = seconds
        },
		
        withdraw() {
            this.getTronWeb().then(tronWeb => {                
                contract.withdraw().send({shouldPollResponse: true}).then(res => {
                    this.getContractInfo();
                    this.getUserInfo();                    
                });
            });
        },
		
        reinvest() {
            this.getTronWeb().then(tronWeb => {
                //this.notice('Confirm transaction', 'fb8c00');
                contract.reinvest().send({shouldPollResponse: true}).then(res => {
					this.getContractInfo();
                    this.getUserInfo();
                    //this.notice('Reinvest successful', '4caf50');                   
                 
                });
            });
        },			
		
    },
    watch: {
        'tron.account' () {
            this.player.wallet.id = this.tron.account

            if (contract) {
                contract.NewDeposit().watch((err, event) => {
                    if (event.result.addr == this.tron.account) {
                        this.getUserInfo()
                    }
                })
                this.checkState()                
            }
        }
    },
    mounted () {
        let m = location.search.match(/ref=(T[1-9A-HJ-NP-Za-km-z]{33})/i);
        if(m) {
            this.upline = m[1];
            document.cookie = "upline=" + this.upline + "; path=/; expires=" + (new Date(new Date().getTime() + 86400 * 365 * 1000)).toUTCString();
        }

        m = document.cookie.match(/upline=(T[1-9A-HJ-NP-Za-km-z]{33})/i);
        if(m) this.upline = m[1];
        
        this.getContract()
        this.checkState()

        setInterval(() => {            
			this.getContractStartTime()
        }, 1000)
    
        var inter_terms = setInterval(() => {
            if (this.tron.account != '') {                
                clearInterval(inter_terms)
            }
        }, 500)
    }
};
