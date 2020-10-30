window.app = new Vue({
    el: '#App',
    mixins: [VueTRON],
    data: {
        days_period: 24,
        periods: [
            { min_amount: 100, max_amount: 1000000, percent: 240 }
        ],
        plans: [
            {days: 24, final_perc: 240}
        ],
        player: {
            wallet: {
                id: '',
                balance: 0
            },
			refer_bonus: 0,
			cback_bonus: 0,
			total_deposited: 0,
			total_reinvested: 0,
            total_withdrawn: 0,
			total_refer_bonus: 0,
			active_deposit: 0,			
			deposits_count: 0,
			reinvest_count: 0,
			dividends: 0,
			tarifN: 0,
			tarifB: 0,
			refLevel1: 0,
			refLevel2: 0,
			allDivs: 0,
			structure: [0, 0]
        },
        plan: 0,
        invest: 100,		
        levels: ['ONLY'],
        playerLevel: '',
        playerLevelColor: '',
        minutes_withdraw: 0,
		minutes_reinvest: 0,
        withdraw_allowed: false,
		reinvest_allowed: false,
        images: {
            invest: [     
                
            ]
        },
        referrals: [
            {level: 1, percent: 10},
            {level: 2, percent: 5}
        ],
        terms_text: '',
        check_terms: false,
        read_terms: '',
        terms_title: '',
        terms_accept: '',
        terms_close: '',
        terms_understand: '',
        terms: {
            accepted: false,
            date: ''
        },
        is_investing: false,
        investing_tarif: 0,
        investing_amount: 0
    },
    computed: {
        roi_message() {
            let message = `<span class="highlighted">9% up to ${this.plans[this.periods.length - 1].final_perc}%</span> ROI`

            return message
        },
        current_percentage() {
            let total_invest = this.player.amount_invested //+ this.invest
            let invest_percentage = 0

            for (let i = 0; i < this.periods.length; i++) {
                if (total_invest >= this.periods[i].min_amount && (total_invest <= this.periods[i].max_amount || i == this.periods.length - 1)) {
                    invest_percentage = this.periods[i].percent
                }
            }

            return invest_percentage
        },
        progressColor() {
            let color

            switch (this.current_percentage) {
                case this.periods[0].percent:
                    color = "bg-danger"
                    this.playerLevel = this.levels[0]
                    this.playerLevelColor = "danger"
                    break
                case this.periods[1].percent:
                    color = "bg-warning"
                    this.playerLevel = this.levels[1]
                    this.playerLevelColor = "warning"
                    break
                case this.periods[2].percent:
                    color = "bg-success"
                    this.playerLevel = this.levels[2]
                    this.playerLevelColor = "success"
                    break
                default:
                    color = "bg-danger"
                    this.playerLevel = this.levels[0]
                    this.playerLevelColor = "danger"
                    break
            }

            return color
        },
        invest_caption () {

            if (this.insufficient_funds_Infinite){
                return 'Insufficient funds'
            }
            else {
                return 'Invest'
            }
            
        },
	
	
        insufficient_funds () {
            return this.player.wallet.balance - 2 < this.invest
        }	
	
    },
    methods: {
        notice(msg, color = '007eff', time = 3000) {
            return new Promise((resolve, reject) => {
                let wrap = $('<div style="position:fixed; left:calc(50% - 150px); box-shadow:0 5px 25px rgba(0,0,0,0.2); width:320px; top:40px; background:#' + (color ? color : '007eff') + '; border-radius:10px; color:#fff; padding:20px 20px; font:14px/1.2 Tahoma, sans-serif; cursor:pointer; z-index:999999; text-align:center;" class="animate__animated animate__fadeInDownBig">' + msg + '</div>')
                    .on('click', () => { wrap.addClass('animate__fadeOutUpBig'); resolve(); })
                    .appendTo('body');
                if(time) setTimeout(() => { wrap.addClass('animate__fadeOutUpBig'); }, time);
            });
        },
        setPlan (event) {
            this.plan = parseInt(event.target.value)
        },
        plan_selected (index) {
            if (index == this.plan) {
                this.anime('#earn', 'heartBeat')
                return 'plan-selected animate__animated animate__flip'
            }
            else {
                return ''
            }
        },
        image_plan (index) {
            if (index == this.plan) {
                return 'images/' + this.images.invest[index] + '-selected.png'
            }   
            else {
                return 'images/' + this.images.invest[index] + '-unselected.png'
            }       
        },
        anime (_elem, animation) {
            let elem = document.querySelector(_elem).classList

            animation = 'animate__' + animation

            if (!elem.contains('animate__animated')) {
                elem.add('animate__animated', animation)
                setTimeout(() => {
                    elem.remove('animate__animated', animation)
                }, 500)
            }
        },
        copyText(value) {
            let s = document.createElement('input');
            s.value = value;
            document.body.appendChild(s);

            if(navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                s.contentEditable = true;
                s.readOnly = false;
                let range = document.createRange();
                range.selectNodeContents(s);
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                s.setSelectionRange(0, 999999);
            }
            else s.select();

            try { document.execCommand('copy'); /*this.notice('Link copied to clipboard', '4caf50');*/ }
            catch (err) { }

            s.remove();
        },
        date_format (date) {
            let year = date.getFullYear()
            let month = ( date.getMonth() + 1 ).toString().padStart(2, '0')
            let day = ( date.getDate() ).toString().padStart(2, '0')

            let hours = ( date.getHours() ).toString().padStart(2, '0')
            let minutes = ( date.getMinutes() + 1 ).toString().padStart(2, '0')
            let seconds = ( date.getSeconds() ).toString().padStart(2, '0')

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },
        getTermsText (lang) {

            if (lang == 'en') {
                this.read_terms = 'Please read and agree the conditions to be able to invest.'
                this.terms_title = "Terms and Conditions"
                this.terms_accept = "Agree"
                this.terms_close = "Close"
                this.terms_understand = 'I understand and accept the conditions and risks of the game.'
            }
            else {
                this.read_terms = 'Por favor lea y acepte las condiciones para poder invertir.'
                this.terms_title = 'Términos y Condiciones'
                this.terms_accept = "Aceptar"
                this.terms_close = "Cerrar"
                this.terms_understand = 'Entiendo y acepto las condiciones y riesgos del juego.'
           }

            this.terms_text = ''

            jQuery.ajax({
                method: 'get',
                url: 'terms.php',
                dataType: "json",
                data: {
                    lang
                }
            })
            .done(data => {
                this.terms_text = data.terms
            })
        },

        convertTimestamp (timestamp) {
            var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
                  yyyy = d.getFullYear(),
                  mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
                  dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
                  hh = d.getHours(),
                  h = hh,
                  min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
                  ampm = 'AM',
                  time;
                                 
              // ie: 2013-02-18, 8:35 AM	
              time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min
                  
              return time;
          },
          accept_terms () {
            jQuery.ajax({
                method: 'post',
                url: 'aceptaciones.php',
                dataType: "json",
                data: {
                    wallet: this.tron.account
                }
            })
            .done(data => {
                this.terms.date = this.convertTimestamp( data.date )
                this.terms.accepted = (data.date != '')

                if (this.is_investing) {
                    this.deposit_(this.investing_tarif, this.investing_amount)
                    this.investing_tarif = 0
                    this.investing_amount = 0
                    this.is_investing = false
                }
            })
          }
    },
    mounted () {
    }
})

Vue.config.devtools = true