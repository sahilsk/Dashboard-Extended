

var user  = [
	{username: "sahilsk", id:2343, email:"sonukr666@gmail.com", password:"abc"},
	{username: "sonu", id:2343, email:"sonu.k.meena@apyl.com", password:"abcd"}
];


exports.User = function(){ return user;}

exports.User =
{


	user:  [
		{username: "sahilsk", id:2343, email:"sonukr666@gmail.com", password:"abc"},
		{username: "sonu", id:2343, email:"sonu.k.meena@apyl.com", password:"abc"}
	],

	find : function(id){
		var iUser = null;
		this.user.forEach(function(u){
			 if( u.id==id){
			 	iUser =u; 
			}
		 });
		return iUser;
	},
	where  : function( paramObj){
		var iUser = null;
		var foundUsers = [];
		this.user.forEach(function(u){

			iUser = u;
			for(key in paramObj){
				if( u.hasOwnProperty(key) ){
					if( u[key] !== paramObj[key] ){
						iUser = null;
					}
				}else
					iUser = null;
			}
			if(iUser !== null){
				foundUsers.push( iUser );
			}

		});
		return foundUsers;


	}
}