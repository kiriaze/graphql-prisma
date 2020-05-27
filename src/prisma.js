import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

const createPostForUser = async (authorId, data) => {
  
  const userExists = await prisma.exists.User({ id: authorId });

  if ( !userExists ) throw new Error('User not found');

  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ author { id name email posts { id title published } } }')

  return post.author;
}

// createPostForUser('ckanddh9500al0709qp5s11uy', {
//   title: 'How to be a boss',
//   body: 'This is packed with awesome facts',
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })
//   .catch(err => console.log(err))


const updatePostForUser = async (postId, data) => {

  const postExists = await prisma.exists.Post({ id: postId });

  if ( !postExists ) throw new Error('Post not found');

  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data
  }, '{ author { id name email posts { id title published } } }')

  return post.author;
}

// updatePostForUser('ckaoo4ea004rk0829ki55lg60', {
//   published: false,
//   body: 'So cooool'
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err))
