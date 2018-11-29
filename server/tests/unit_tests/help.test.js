const {User}         = require('../../models/users');
const {Trip}         = require('../../models/trip');
const {HelpPost}     = require('../../models/helppost');
const {PlacePoints}  = require('../../models/placepoints');

    beforeEach(async() => {
	
        user1 = new User({
		    name      : "Anku1", 
		    email     : "ankit1@gmail.com",
		    password  : "password",
		    active    : true,
		    isAdmin   : false,
		    privacy   : "public"
	    });
	
	    user1.save();
		
		user2  = new User({
			name      : 'Manju',
			email     : 'manju@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public'
		});
		
		user2.save();
		
		user3  = new User({
			name      : 'Harman',
			email     : 'harman@gmail.com',
			password  : 'password',
			active    :  true,
			isAdmin   :  false,
			privacy   : 'public'
		});
		
		user3.save();
		
		hpost   = new HelpPost({
			owner    : user1,
		    ownerId  : user1._id,
		    location : 'viva mall',
		    city     : 'jalandhar',
		    country  : 'india',
		    tags     : ['need suggestion','foodie','help'],
		    post     : 'Test Post lest what wis going to happen',
			Comments : [
			    {
					CommentedUser : user3,
					comment       : 'Comment By Harman',
					helped        : false
				},
				{
					CommentedUser  : user2,
					comment        : 'Comment By Manju',
					helped         : false
				}
			]
		});
		
		hpost.save();
		
		user1.helpPosts.push(hpost);
		
		
				
    }); 

describe('Post a Help Post',() => {

    it('should post a helpost',() => {
				
   	    var help  = new HelpPost({
            owner    : user1,
		    ownerId  : user1._id,
		    location : 'rest',
		    city     : 'jld',
		    country  : 'india',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	   });
	
	    help.save();
		
	    user1.helpPosts.push(help);
		expect(user1.helpPosts[1].location).toBe('rest');
		expect(user1.helpPosts[1].ownerId).toBe(user1._id.toString());
			    
	});
	
	
});



describe('mark a Comment Helpful',() => {
		
	it('should update the comment helpful in the post',async() => {
        
	//	console.log(hpost);
		
			//    var CommentId = await hpost.Comments[0]._id;
	
	    
	//	console.log(CommentId);
	    /*
	    HelpPost.find({'_id' : hpost._id , 'Comments._id' : CommentId})
		    .then((post) => {
				console.log(post);
			}).catch((e) => {
				console.log(e);
			})
		*/
	    /*
	    const hhpost  = await HelpPost.findOne({ '_id' : hpost._id , 'Comments._id' : CommentId});
	    */
	    /*
	    const hhpost = await HelpPost.findOneAndUpdate(
			{ '_id' : hpost._id , 'Comments._id' : CommentId },
			{ $set  :   {
				            'Comments.$.helped' : true 
			            }
			}
		);
		*/
		
		//console.log(hhpost);
	
	});
	
	
});



/*

describe('Should return help post acc to their country',() => {
	
	
	beforeEach(() => {
	
        help1  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'Mumbai',
		    country  : 'india',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
	
	    help1.save();
	
	    help2  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'Chennai',
		    country  : 'usa',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
	
	    help2.save();
	
	    help3  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'Florida',
		    country  : 'usa',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
	
	    help3.save();
	
	    help4  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'New York',
		    country  : 'usa',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
		
		help4.save();
		
		help5  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'Cale',
		    country  : 'usa',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
	
	    help5.save();
	
	    help6  = new HelpPost({
            owner    : user,
		    ownerId  : user._id,
		    location : 'rest',
		    city     : 'Montreal',
		    country  : 'canada',
		    tags     : ['sugesstion','help'],
		    post     : 'Just Testing it all'
	    });
	
	    help6.save();
			
    }); 
	
	
	it('should give all post of usa',async() => {

		var posts = HelpPost.find({ country : 'usa' });
		console.log(posts);
	//	expect(posts.length).toBe(3);

	});
	
	it('should give all posts of canada',() => {
		
		const posts = HelpPost.find({ country : 'canada' });
		
		expect(posts.length).toBe(1);
		
	});
	
	it('should give all posts of India',() => { 
	   
	    const posts = HelpPost.find({ country : 'india' });
		
		expect(posts.length).toBe(2);
        		
	});
	
})

*/
