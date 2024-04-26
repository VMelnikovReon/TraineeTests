const CONFIG = {
	// данные для api amocrm
	CLIENT_SECRET:
		"KrUBZ4uzhtsUysTwZrLGNA6jEugpcMW95psUzJQ2lla9WcFajww8q5KwT6NRQqOR",
	//AUTH_CODE живет 20 минут, при перезапуске скрипта нужно брать новый

	REDIRECT_URI: "https://5562-77-95-90-50.ngrok-free.app/api/widget/install",
	SUB_DOMAIN: "megasupertest",
	// конфигурация сервера
	PORT: 8000,

	BD_CONNECTION_STRING: 'mongodb://127.0.0.1:27017/testTraine'
};

export default CONFIG;
