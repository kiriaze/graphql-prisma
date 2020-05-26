import {
  v4 as uuidv4
} from 'uuid';

const Mutation = {
  createUser(parent, args, {
    db
  }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) throw new Error('Email taken.');

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user);

    return user;

  },
  deleteUser(parent, args, {
    db
  }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id);
    if (userIndex === -1) throw new Error('User not found');

    const deletedUsers = db.users.splice(userIndex, 1);

    // delete all of users posts
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match;
    })

    // delete all of users comments
    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);
    if ( !user ) throw new Error('No user found');

    if ( typeof data.email === 'string' ) {
      const emailTaken = db.users.some(user => user.email === data.email);
      if ( emailTaken ) throw new Error('Email taken')
      user.email = data.email;
    }

    if ( typeof data.name === 'string' ) {
      user.name = data.name;
    }

    if ( typeof data.age !== 'undefined' ) {
      user.age = data.age;
    }

    return user;

  },
  createPost(parent, args, {
    db,
    pubsub
  }, info) {
    const user = db.users.some(user => user.id === args.data.author);

    if (!user) throw new Error('User not found');

    const post = {
      id: uuidv4(),
      ...args.data
    }

    db.posts.push(post);
    // db.posts.unshift(post);

    if ( post.published )
    pubsub.publish('post', {
      post: {
        mutation: 'CREATED',
        data: post
      }
    })

    return post;

  },
  deletePost(parent, args, {
    db,
    pubsub
  }, info) {
    const post = db.posts.find(post => post.id === args.id);
    if (!post) throw new Error('Post not found');

    db.posts = db.posts.filter(post => post.id !== args.id);
    db.comments = db.comments.filter(comment => comment.post !== args.id)

    if ( post.published ) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post;

  },
  updatePost(parent, args, { pubsub, db }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    if ( !post ) throw new Error('Post not found')

    const originalPost = {...post};

    if ( typeof data.title === 'string' ) {
      post.title = data.title;
    }

    if ( typeof data.body === 'string' ) {
      post.body = data.body;
    }

    if ( typeof data.published === 'boolean' ) {
      post.published = data.published;

      if ( originalPost.published && !post.published ) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost // w/o broadcasting the updated data, returning only the original ref
          }
        })
      } else if ( !originalPost.published && post.published ) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if ( post.published ) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post;
  },
  createComment(parent, args, {
    db,
    pubsub
  }, info) {
    const user = db.users.some(user => user.id === args.data.author);
    const post = db.posts.some(post => post.id === args.data.post && post.published);
    if (!user || !post) throw new Error('User and post not found.')

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment;
  },
  deleteComment(parent, args, {
    db,
    pubsub
  }, info) {
    const comment = db.comments.find(comment => comment.id === args.id);
    if (!comment) throw new Error('Comment does not exist');
    db.comments = db.comments.filter(comment => comment.id !== args.id);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment;
  },
  updateComment(parent, args, {
      db,
      pubsub
    }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);
    if ( !comment ) throw new Error('Comment not found');
    if ( typeof data.text === 'string' )
      comment.text = data.text;
    
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    
    return comment;
  }
}

export { Mutation as default }