import { css } from '@emotion/react';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout';
import {
  getCommentsByPostId,
  getPostById,
  getUserByValidSessionToken,
  Post,
} from '../../util/database';

// const appNameStyles = css`
//   font-family: 'Allura', cursive;
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-align: center;
// `;
const postContainerStyles = css`
  background: #f2eff8;
  gap: 300px;
  border-radius: 4px;

  justify-content: center;
`;

const arrowStyles = css`
  margin-right: 10px;
  margin-bottom: 15px;

  :hover {
    cursor: pointer;
  }
`;

const pictureStyles = css`
  display: block;
  margin-top: 50px;
  border-radius: 10px;
  margin-left: 300px;
`;

const commentSectionStyles = css`
  font-weight: bold;
  display: block;
  border-radius: 2px;
  margin-top: 40px;
  margin-left: 250px;
  width: 600px;

  padding: 20px;
  box-shadow: 1px 3px 5px #3b3b3b;
  button {
    background: transparent;
    border: none;
    cursor: pointer;
  }
  textarea {
    font-family: inter;
    width: 450px;
    margin-left: 30px;
    margin-right: 30px;
  }
`;

const pictureInfoStyles = css`
  button {
    background: transparent;
    border: transparent;
    cursor: pointer;
    justify-items: right;
  }

  border-radius: 2px;
  margin-left: 250px;
  width: 587px;
  height: 100px;
  margin-top: 20px;
  /* margin: 30px 0px; */
  padding: 10px 20px 80px 30px;
  box-shadow: 1px 3px 5px #3b3b3b;
  align-items: right;
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;
    color: black;
  }
`;

type Props = {
  userObject: { spotName: string; heroImage: string };
  post: Post;

  postComments: {
    id: number;
    userId: number;
    postId: number;
    commentText: string;
    username: string;
    heroImage: string;
  }[];
  userId: number;
  username: string;
};

export default function PostDetails(props: Props) {
  const [commentText, setCommentText] = useState<string>('');
  const [newComment, setNewComment] = useState(props.postComments);

  const deleteComment = async (id: number) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: id,
      }),
    });

    const newResponse = await response.json();
    console.log('newResponse)', newResponse.deletedComment);
    const newCommentList = newComment.filter((comment) => {
      return newResponse.deletedComment.id !== comment.id;
    });
    setNewComment(newCommentList);
  };

  if ('errors' in props) {
    return <h1>Not authenticated to view this page</h1>;
  }

  return (
    <div>
      <Layout userObject={props.userObject}>
        <Head>
          <title>{props.username}</title>
          <meta
            name="description"
            content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>
          <div css={arrowStyles}>
            <Typography>
              <Link href="/">
                <ArrowBackIcon />
              </Link>
            </Typography>
          </div>
          <div css={postContainerStyles}>
            <div css={pictureStyles}>
              <img
                src={props.post.pictureUrl}
                alt="uploaded post"
                width="500px"
                height="500px"
              />
            </div>
            <div css={pictureInfoStyles}>
              <br />
              <div>Spot: {props.post.spotName}</div>
              <br />
              <div>Description: {props.post.postDescription}</div>
              <br />
              <div>
                <LocationOnIcon /> {props.post.location}
              </div>
              {/* <div>{props.post.postTags}</div> */}
              <br />
              <div>
                <Link href={`/users/${props.post.userId}`}>
                  <a>posted by: @{props.post.username}</a>
                </Link>
              </div>
            </div>

            <div css={commentSectionStyles}>
              <p>Comments </p>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const commentResponse = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: props.userId,
                      commentText: commentText,
                      postId: props.post.id,
                      username: props.username,
                      heroImage: props.userObject.heroImage,
                    }),
                  });
                  const commentResponseBody = await commentResponse.json();

                  console.log('commentResponseBody', commentResponseBody);
                  setCommentText('');

                  const newCommentsList = [
                    ...newComment,
                    commentResponseBody.comment,
                  ];
                  setNewComment(newCommentsList);

                  return;
                }}
              >
                <div>
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                  />
                  <button>
                    <AddCommentIcon />
                  </button>
                </div>
                <br />
              </form>
              {newComment.length === 0 ? (
                <div> </div>
              ) : (
                newComment.map((event) => {
                  return (
                    <div key={event.commentText}>
                      <img src={event.heroImage} alt="user" />
                      <p>
                        {' '}
                        {event.username}: <span>{event.commentText}</span>
                      </p>
                      {props.userId === props.post.userId && (
                        <button
                          onClick={() => {
                            deleteComment(event.id).catch(() => {});
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

// Code in getServerSideProps runs only in
// Node.js, and allows you to do fancy things:
// - Read files from the file system
// - Connect to a (real) database
//
// getServerSideProps is exported from your files
// (ONLY FILES IN /pages) and gets imported
// by Next.js

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postIdFromUrl = context.query.postId;
  const sessionToken = context.req.cookies.sessionToken;
  const loggedInUser = await getUserByValidSessionToken(sessionToken);

  // checking that the user param is a string
  if (!postIdFromUrl || Array.isArray(postIdFromUrl)) {
    return { props: {} };
  }

  const post = await getPostById(parseInt(postIdFromUrl));

  if (!postIdFromUrl) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  if (!loggedInUser) {
    return {
      props: {
        error: 'You need to be logged in',
      },
    };
  }
  const postComments = await getCommentsByPostId(parseInt(postIdFromUrl));
  return {
    props: {
      post: post,
      postId: postIdFromUrl,
      userId: loggedInUser.id,
      postComments: postComments,
    },
  };
}
