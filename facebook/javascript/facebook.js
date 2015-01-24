var MIAPP = {
	publicar : function(mensaje) {
		FB.api("/me", "get", function(response) {
			//primero obtenemos el nombre del usuario y recibmos el mensaje

			//publcamos: link, picture, name, message
			FB.api("/me/feed", "post", {

			}, function() {
				if (!response || response.error) {
					//SI OCURRE UN ERROR
				} else {//SI FUE BIEN

				}

			});
		});
	},

	muestraLogin : function() {
		FB.login(function(response) {
			if (response.authResponse) {
				//jugar
				jugar();
			} else {
				//no acepto usar al app :(
				alert("No acepto :( )");
			}
		}, {
			scope: "email, publish_actions"
		});

	}
};

$(function() {
	FB.init({
		appId : '1420492451522812',
		xfbml : true,
		version : 'v2.0'
	});

	//si es usuario esta conectado (connected) ->Jugar!
	//sino, hay que mostrarle el login
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			//inicia al app
			jugar();
		} else {
			//mostrar el login
			MIAPP.muestraLogin();
		}
	});


});
