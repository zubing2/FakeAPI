const postDisplayFormat = document.querySelector('.postDisplay'),
    userDisplayFormat = document.querySelector('.userDisplay'),
    commentDisplayFormat = document.querySelector('.commentPostDisplay'),
endPoint = "https://jsonplaceholder.typicode.com";


async function wrapper () {
    let users, posts = [], selectedPost, oldPost = undefined, postedComments = [];
    (await fetch(`${endPoint}/users`).then(async (response) => {
        users = await response.json();
        users.forEach(async (user) => {
            let newUser = userDisplayFormat.cloneNode(true);
            newUser.getElementsByClassName('userName')[0].innerHTML = `${user.username} (${user.name})`;
            newUser.getElementsByClassName('userEmail')[0].innerHTML = user.email;
            newUser.getElementsByClassName('userCompany')[0].href = user.website;
            newUser.getElementsByClassName('userCompany')[0].innerHTML = user.company.name;
            newUser.getElementsByClassName('userCompanyCatchphrase')[0].innerHTML = user.company.catchPhrase;
            newUser.style.display = "grid";

            userDisplayFormat.parentNode.insertBefore(newUser, userDisplayFormat);
            (await fetch(`${endPoint}/users/${user.id}/posts`).then(async (response) => {
                posts.push(await response.json());
            }));

            posts.forEach((postArray) => {
                postArray.forEach((post) => {
                    console.log(user.id)
                let newPost = postDisplayFormat.cloneNode(true);
                newPost.getElementsByClassName('postAuthor')[0].innerHTML = `${user.name} (@${user.username})`;
                newPost.getElementsByClassName('postTitle')[0].innerHTML = post.title;
                newPost.getElementsByClassName('postText')[0].innerHTML = post.body;
                newPost.id = `${post.id}:${post.userId}`;
                newPost.style.display = "grid";

                postDisplayFormat.parentNode.insertBefore(newPost, postDisplayFormat)
                newPost.addEventListener('mouseover', () => {if (selectedPost != newPost) newPost.style.boxShadow = "0 4px 8px 0 lightsalmon inset"});
                newPost.addEventListener('mouseleave', () => {if (selectedPost != newPost)  newPost.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)"});
                newPost.addEventListener('click', () => {
                    if (oldPost != undefined) {
                        oldPost = selectedPost; selectedPost = newPost;
                        postedComments.forEach((c) => c.remove());
                    } else {
                        oldPost = newPost; selectedPost = newPost;
                    }

                    let s = document.getElementById('selectedPost');
                    s.getElementsByClassName('selectedPostAuthor')[0].innerHTML = `${user.name} (@${user.username})`;
                    s.getElementsByClassName('selectedPostTitle')[0].innerHTML = post.title;
                    s.getElementsByClassName('selectedPostText')[0].innerHTML = post.body;

                    fetch(`${endPoint}/posts/${post.id}/comments`).then(async (response) => {
                        let comments = await response.json();
                        console.log(comments);
                        comments.forEach(async (comment) => {
                            let newUComment = commentDisplayFormat.cloneNode(true);
                            newUComment.getElementsByClassName('commentAuthor')[0].innerHTML = `Reply by ${comment.email}`;
                            newUComment.getElementsByClassName('commentText')[0].innerHTML = comment.body;
                            newUComment.getElementsByClassName('commentTitle')[0].innerHTML = comment.name;
                            newUComment.style.display = "grid";

                            postedComments.push(newUComment);
                            commentDisplayFormat.parentNode.insertBefore(newUComment, commentDisplayFormat);
                        });
                    });
                });
                })
            });
        });
    }));
}

wrapper()