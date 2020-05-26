const Query = {
  users(parent, args, {
    db
  }, info) {
    if (!args.query) return db.users;
    return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  posts(parent, args, {
    db
  }, info) {
    if (!args.query) return db.posts;
    let term = args.query.toLowerCase();
    return db.posts.filter(post => {
      if (
        post.title.toLowerCase().includes(term) ||
        post.body.toLowerCase().includes(term)
      ) return post;
    })
  },
  comments(parent, args, {
    db
  }, info) {
    return db.comments;
  },
  me() {
    return {
      id: '123',
      name: 'Bob Ross',
      email: 'bob@ross.com'
    }
  },
  post() {
    return {
      id: '321',
      title: 'How to make eggs',
      body: 'Step 1: Buy eggs.',
      published: true
    }
  }
}

export { Query as default }