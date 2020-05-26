const users = [{
    id: '1',
    name: 'CK',
    email: 'ckiriaze@gmail.com',
    age: 31
  },
  {
    id: '2',
    name: 'Bob Ross',
    email: 'bob@ross.com'
  },
  {
    id: '3',
    name: 'Jabroni',
    email: 'jabroni@gmail.com'
  }
]

const posts = [{
    id: '11',
    title: 'First post',
    body: 'Man my eyes hurt!',
    published: true,
    author: '1'
  },
  {
    id: '12',
    title: 'Second Post',
    body: 'Hello friend.',
    published: true,
    author: '1'
  },
  {
    id: '13',
    title: 'Third Post',
    body: 'Wooopdydooda',
    published: false,
    author: '2'
  }
]

const comments = [{
    id: '91',
    text: 'Dope post!',
    author: '1',
    post: '11'
  },
  {
    id: '92',
    text: 'That\'s interesting..',
    author: '2',
    post: '12'
  },
  {
    id: '93',
    text: 'I gotta sleep on this!',
    author: '3',
    post: '13'
  },
  {
    id: '94',
    text: 'Who is this?',
    author: '1',
    post: '11'
  }
]

const db = {
  users,
  posts,
  comments
}

export { db as default };