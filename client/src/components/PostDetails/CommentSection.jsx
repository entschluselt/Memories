import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments); // we are getting the redux data from the backend and putting it in our comments
  const classes = useStyles();
  const commentsRef = useRef(); // to scroll on addition of comments automatically

  const handleComment = async () => {  // on submit comment we'll try to connect this to the backend 
    const newComments = await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id)); // for this we must create the action

    setComment('');
    setComments(newComments);

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(': ')[0]}</strong>
              {c.split(':')[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && ( // only if the user exists then show the new comment feature
          <div style={{ width: '70%' }}>
            <Typography gutterBottom variant="h6">Write a comment</Typography>
            <TextField fullWidth minRows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
            <br />
            <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;