var users = [
    {
        id : 1,
        name : 'Hoang'
    },
    {
        id : 2,
        name : 'Ong B'
    },
    {
        id : 3,
        name : 'Loi'
    }
]

var comments = [
    {
        id : 1,
        user_id : 1,
        content : 'Alo, alo'
    },
    {
        id : 2,
        user_id : 3,
        content : 'Blo blo' 
    },
    {
        id : 1,
        user_id : 1,
        content : 'what\'s up '
    },
]

var avatars = [
    {
        id: 1,
        user_id: 1,
        link: 'google.com'
    },
    {
        id: 2,
        user_id: 4,
        link: 'f8.edu.vn'
    },
    {
        id: 3,
        user_id: 3,
        link: 'fullstack.edu.vn'
    }
]

// 1. Goi Api(url) lay comment
// 2. Tu comment lay user_id, tu user_id  lay ra user tuong ung

//Fake Api
function getComments () {
    return new Promise(function (resolve, reject) {
        setTimeout(function(){
            resolve(comments)
        }, 1000)
    })
}

function getUsersByIds(usersId) {
    return new Promise(function(resolve){
        //lấy user_id của comment so sánh với id của users
        var result = users.filter(function(user) {
            return usersId.includes(user.id) 
        });
        setTimeout(function(){
            resolve(result)
        },1000);
    })
}

function getAvatarByIds(usersId){
    return new Promise(function(resolve) {
        var result1 = avatars.filter(function(avatar) {
            return usersId.includes(avatar.id)
        });
        resolve(result1)
    })
}

getComments()
    .then(function (comments) {
        var usersId = comments.map(function(comment){
            return comment.user_id
        });
        return getUsersByIds(usersId)
            .then(function(users){
                return getAvatarByIds(usersId)
                .then(function(avatars){
                    return {
                        users : users,
                        comments : comments,
                        avatars : avatars
                    }
                })
            })
    })
    .then(function(data) {
        var commentBlock = document.getElementById('comment-block')
        var html = '';
        //Sử dụng 2 vòng lặp qua comments rồi qua users để get user vào comment
        data.comments.forEach(comment => {
            var user = data.users.find(function(user) {
                return user.id === comment.user_id
            })
            var avatars = data.avatars.find(function(avatar) {
                return avatar.user_id === comment.user_id
            })
            html += `<li>${avatars.link} - ${user.name}: ${comment.content}</li>`
        })

        commentBlock.innerHTML = html
    })

