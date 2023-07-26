import React, { useState } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import { useHistory, useLocation } from 'react-router-dom'; //location -> to check which page we are currently and history to renavigate
import ChipInput from 'material-ui-chip-input'; // great use for tags

import { getPostsBySearch } from '../../actions/posts';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
    return new URLSearchParams(useLocation().search); // setup for URL search params to know what page we are currently on and what search term are we looking for
}

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);

    const searchPost = () => {
        if(search.trim() || tags){
            // dispatch -> fetch search post // for that we must first create redux action and reducer to match our post 
            dispatch(getPostsBySearch({ search, tags: tags.join(',') })); // now we must create the endpoint of api getPostsBySearch in the backend
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else{
            history.push('/');
        }
    };

    const handleKeyPress = (e) => {
        // 13 is the 'ENTER' key here
        if(e.keyCode === 13){
            searchPost();
        }
    };

    const handleAdd = (tag) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete))

    return (
        <Grow in>
            <Container maxWidth='xl'>
            <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} sm={6} md={9}>
                <Posts setCurrentId = {setCurrentId}/>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                <TextField name="search" variant="outlined" label="Search Posts" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                <ChipInput
                    style={{ margin: '10px 0' }}
                    value={tags}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    label="Search Tags"
                    variant="outlined"
                />
                <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
                </AppBar>
                <Form currentId = {currentId} setCurrentId = {setCurrentId}/>
                {(!searchQuery && !tags.length) && (
                    <Paper elevation={6} className={classes.pagination}>
                        <Pagination page={page} />
                    </Paper>
                )}
                </Grid>
            </Grid>
            </Container>
        </Grow>
    )
}

export default Home