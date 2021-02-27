export default (parsedPosts, postsInState) => parsedPosts.filter(
  (parsedPost) => postsInState.some(
    (postInState) => !postInState.id === parsedPost.id,
  ),
);
