import { FC } from 'react';
import Diaries from '../diary/Diaries';
import Editor from '../entry/Editor';
import Grid from '@material-ui/core/Grid';

const Home: FC = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Diaries />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Editor />
      </Grid>
    </Grid>
  );
};

export default Home;