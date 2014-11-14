module.exports = {
    connection: {
        host: 'app-001.ecs.soton.ac.uk',
//        login: 'sociam',
//        password: 'Sociam2014',
        login: 'livementions',
        password: 'l1vementi0n5',
        port: 5672
    },
    // exchange: 'twitter_hose'
  	//exchanges: ['wikipedia_hose','twitter_hose']
  	exchanges: ['trends_hose']
};
