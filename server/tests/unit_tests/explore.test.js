const {User}         = require('../../models/users');


describe('Should return the no of online users of diff countries',() => {
	
	
	beforeEach(async() => {
	
        user1 = new User({
		    name      : "Anku1", 
		    email     : "ankit1@gmail.com",
		    password  : "password",
		    active    : true,
		    isAdmin   : false,
		    privacy   : "public",
			online    : true,
			country   : 'usa'
	    });
	
	    user1.save();
		
		user2  = new User({
			name      : 'Manju',
			email     : 'manju@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : true,
			country   : 'usa'
		});
		
		user2.save();
		
		user3  = new User({
			name      : 'Harman',
			email     : 'harman@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : true,
			country   : 'usa'
		});
		
		user3.save();
		
	    user4 = new User({
		    name      : "demo4", 
		    email     : "demo4@gmail.com",
		    password  : "password",
		    active    : true,
		    isAdmin   : false,
		    privacy   : "public",
			online    : false,
			country   : 'usa'
	    });
	
	    user4.save();
		
		user5  = new User({
			name      : 'demo5',
			email     : 'demo5@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : true,
			country   : 'canada'
		});
		
		user5.save();
		
		user6  = new User({
			name      : 'demo6',
			email     : 'demo6@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : true,
			country   : 'canada'
		});
		
		user6.save();
		
		user7 = new User({
		    name      : "demo4=7", 
		    email     : "demo4=7@gmail.com",
		    password  : "password",
		    active    : true,
		    isAdmin   : false,
		    privacy   : "public",
			online    : true,
			country   : 'usa'
	    });
	
	    user7.save();
		
		user8  = new User({
			name      : 'demo8',
			email     : 'demo8@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : true,
			country   : 'canada'
		});
		
		user8.save();
		
		user9  = new User({
			name      : 'demo9',
			email     : 'demo9@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    : false,
			country   : 'india'
		});
		
		user9.save();
		
		user10  = new User({
			name      : 'demo10',
			email     : 'demo10@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public',
			online    :  false,
			country   : 'india'
		});
		
		user10.save();
		

					
    }); 
	
	
	it('should return no of users online from usa',async() => {
		//var nousers;
		
		//var testusers = User.find();
		//console.log(testusers.length);
		
		
		var usaonline =  User.find({
			                $and : [
			                    { country : 'usa' },
			                    { online  : true  }
			                ]
		                    		
	                    }).count();
		
		expect(user1.name).toBe('Anku1');
		//expect(user1.helpPosts[1].location).toBe('rest');
		//console.log(usaonline);
		
		/*
		User.find({
			        $and : [
			                { country : 'usa' },
			                { online  : true  }
			               ]
		                    		
	            }).then((users) => {
					this.nousers = users;
					console.log(users);
				}).catch((e) => {
					console.log(e);
				});
		
		
		console.log(nousers);
		*/
	
	});
	
	it('should return no of users online from canada',async() => {
		
		
		
	});
	
	it('should return no of users online from india',async() => {
		
		
		
	});
		
});	
	
	