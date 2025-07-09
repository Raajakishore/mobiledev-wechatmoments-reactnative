import React, {ReactElement, useEffect} from 'react';
import {RefreshControl, StyleSheet, View, FlatList} from 'react-native';
import {connect} from 'react-redux';

import {BasicStyle, ITweet, RequestStatus, RootState} from './../../../types';
import {Tweet} from './../../../features/Tweet/ui/Tweet';
import {useAppDispatch} from './../../../hooks';
import {fetchUserTweets} from './../../../features/TweetList/state/tweets.thunk';

interface ITweetListProps {
  tweets: Array<ITweet>;
  loading: RequestStatus;
}

export function TweetListComponent({tweets, loading}: ITweetListProps): ReactElement {
  const dispatch = useAppDispatch();
  const [itemsToShow, setItemsToShow] = React.useState<number>(5);
  

  useEffect(() => {
    dispatch(fetchUserTweets('jsmith'));
  }, [dispatch]);

  const onEndReached = () => {
    if(itemsToShow < tweets.length) {
      setItemsToShow(itemsToShow + 5);
    }
  }

  const onRefresh = () => {
    dispatch(fetchUserTweets('jsmith'));
    setItemsToShow(5);
  }

  return (
    <View style={styles.container}>
      <FlatList
      testID='flatlist'
        data={tweets.slice(0, itemsToShow)}
        renderItem={tweet => <Tweet tweet={tweet.item} />}
        initialNumToRender={5}
        onEndReached={ onEndReached }
        refreshControl={ 
          <RefreshControl 
            refreshing = { RequestStatus.PENDING === loading }
            colors = {["red"]}
            onRefresh = {onRefresh}
          />
        }
      />
    </View>
  );
}

const mapStateToProps = (state: RootState) =>
  ({
    tweets: state.tweets.data,
    loading: state.tweets.status
  } as ITweetListProps);

export const TweetList = connect(mapStateToProps)(TweetListComponent);

const styles: Partial<BasicStyle> = StyleSheet.create<Partial<BasicStyle>>({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
