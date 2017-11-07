var CheckMM_Interval = null;

// In renderer process (web page).
const {ipcRenderer} = require('electron')

ShepherdIPC = function(data) {
	/*ipcRenderer.on('shepherd-reply', (event, arg) => {
		console.log(arg) // prints "pong"
	})
	ipcRenderer.sendSync('shepherd-command', data)*/

	// USING SYNCHRONOUS METHOD TO SEND AND RECIVE IPC COMMANDS/REPLIES
	//console.log(ipcRenderer.sendSync('shepherd-commandSync', 'ping')) // prints "pong"
	let shepherdreply = ipcRenderer.sendSync('shepherd-command', data);
	//console.log(shepherdreply);
	return shepherdreply;
}


$('.dexlogout-btn').click(function(e) {
	e.preventDefault();
	var shepherdresult = ShepherdIPC({"command":"logout"});
	$('.mainbody').fadeOut();
	$('.loginbody').fadeIn();
	//CheckOrderBookFn(false);
	
	//CheckPortfolioFn(false);
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);
	
	//check_coin_balance(false);
	sessionStorage.clear();
});

$('.login-btn').click(function(e) {
	e.preventDefault();
	var passphrase = $('.loginPassphrase').val();
	var shepherdresult = ShepherdIPC({"command":"login","passphrase":passphrase});
	$('.loginPassphrase').val('');
	$('.mainbody').hide();
	$('.loginbody').hide();
	CheckMM_Interval = setInterval(CheckMMStatus,1000);
	$('.loadingbody').fadeIn();
});

CheckMMStatus = function(sig) {
	if (sig == false) {
		clearInterval(CheckMM_Interval);
	} else {
		console.log('Checking MarketMaker Status');
	}

	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').fadeIn();
		$('.loginbody').fadeOut();
		$('.loadingbody').hide();
		/*var refresh_data = {"coin":" ", "status": "enable"};
		enable_disable_coin(refresh_data);
		get_myprices();
		CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);*/
		//check_coin_balance_Interval = setInterval(check_coin_balance,3000);
		
//---- dICO App Settings START ----//
		//CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
		
		selected_coin = {}
		selected_coin.coin = 'MNZ';
		selected_coin.coin_name = 'Monaize';
		console.log(selected_coin);
		sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));
		
		$('.screen-portfolio').hide();
		$('.screen-coindashboard').hide()
		$('.screen-exchange').show();
		$('.coin_ticker').html('MNZ');
		$.each($('.coinexchange[data-coin]'), function(index, value) {
			$('.coinexchange[data-coin]').data('coin', 'MNZ');
		});

		check_coin_balance(false);
		CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);
		check_swap_status_Internal = setInterval(check_swap_status,10000);
		check_swap_status();
		check_bot_list_Internal = setInterval(check_bot_list, 60000);
		check_bot_list();
		check_my_prices_Internal = setInterval(check_my_prices, 60000);
		check_my_prices();
		bot_screen_coin_balance_Internal = setInterval(bot_screen_coin_balance, 30000);
		bot_screen_coin_balance();
		bot_screen_sellcoin_balance_Internal = setInterval(bot_screen_sellcoin_balance, 30000);
		bot_screen_sellcoin_balance();

//---- dICO App Settings END ----//
		
		clearInterval(CheckMM_Interval);
	} else {
		$('.mainbody').fadeOut();
		$('.loginbody').fadeOut();
		$('.loadingbody').fadeIn();
	}
}