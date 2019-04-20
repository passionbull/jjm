import steem from 'steem'
import {Client} from 'dsteem'
const client = new Client('https://api.steemit.com')

export default class steemController{
    getVotingInfo = async (post) => {
        return await client.database
            .call('get_active_votes', [post.author, post.permlink])
            .then(result => {
                if(result.find(o => o.voter === 'virus707') ===undefined){
                    console.log('Wait!!! voting ->'+post.author);
                    post['voted'] = false;
                }
                else{
                    console.log('Got!!! voting ->'+ post.author);
                    post['voted'] = true;
                }
            });
    };


    getPosting = async (size, comp ,last_permlink='', last_author='') => {
        size = size +1;
        var query = {"tag": "jjm", "limit": size, "start_permlink":last_permlink, "start_author":last_author};
        var postInfo = {'this':comp}
        try{
            let post = await this.getDiscussionsByCreated(query);
            postInfo.posts = post.slice(0,size-1);
            postInfo.last_permlink = post[size-1].permlink;
            postInfo.last_author = post[size-1].author;
        }catch(err){
            console.log('err',err);
        }
        return await postInfo;
    }

    getDiscussionsByCreated = (query) => {
        return new Promise((resolve, reject) => {
          steem.api.getDiscussionsByCreated(query, function(err, response) {
         if(err){
           reject(err);
         }
         resolve(response);
        });
       });
    }

    getDiscussionsByBlog = (query) => {
        return new Promise((resolve, reject) => {
          steem.api.getDiscussionsByBlog(query, function(err, response) {
         if(err){
           reject(err);
         }
         resolve(response);
        });
       });
    }
    
}