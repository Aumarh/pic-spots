import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import {
  getCommentsByPostId,
  getPostById,
  getUserByValidSessionToken,
  Post,
} from '../../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

type Props = {
  refreshUserProfile: () => void;
  userObject: { spotName: string; pictureUrl: string };
  post: Post;

  postComments: {
    id: number;
    userId: number;
    postId: number;
    commentText: string;
    username: string;
    pictureUrl: string;
  }[];
  userId: number;
  username: string;
};

export default function PostDetails(props: Props) {
  const [commentText, setCommentText] = useState<string>('');
  const [newComment, setNewComment] = useState(props.postComments);
  const router = useRouter();

  async function deletePostByPostId(id: number) {
    const deleteResponse = await fetch(`/api/post/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: id,
      }),
    });

    props.refreshUserProfile();
    await router.push(`/users/${props.userId}`);
    return deleteResponse;
  }

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
          <h1 css={appNameStyles}>@{props.post.spotName}</h1>
          <div>
            <div>
              <img src={props.post.pictureUrl} alt="uploaded post" />
              <div>
                {props.userId === props.post.userId && (
                  <button
                    onClick={() => {
                      deletePostByPostId(props.post.id).catch(() => {});
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div>
                <p>comments </p>
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const commentResponse = await fetch('/api/comments', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        commentFromUser: commentText,
                        userId: props.userId,
                        postId: props.post.id,
                        pictureUrl: props.userObject.pictureUrl,
                        username: props.userObject.spotName,
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
                    <button>Comment</button>
                  </div>
                </form>
                {newComment.length === 0 ? (
                  <div> </div>
                ) : (
                  newComment.map((event) => {
                    return (
                      <div key={event.commentText}>
                        <img src={event.pictureUrl} alt="user" />
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
                            Delete
                            {/* <Image src="/delete.png" width="20px" height="20px" /> */}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div>
            <div>{props.post.spotName}</div>
            <div>{props.post.postDescription}</div>
            <div>{props.post.locationId}</div>
            <div>{props.post.postTags}</div>
            <div>
              <Link href={`/users/${props.post.userId}`}>
                <a>posted by: @{props.post.username}</a>
              </Link>
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
