// __tests__/TweetList.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TweetListComponent } from './TweetList'; // or the correct relative path
import { fetchUserTweets } from '../state/tweets.thunk';
import { useAppDispatch } from '../../../hooks';
import { mockTweets } from '../state/tweets.mock';
import { RequestStatus } from '../../../types';

jest.mock('./../../../hooks',()=>({
  useAppDispatch: jest.fn()
}));

jest.mock('./../../../features/TweetList/state/tweets.thunk',()=>({
  fetchUserTweets: jest.fn()
}));

describe("TweetList",()=>{
  const mockDispatch = jest.fn();
  beforeEach(()=>{
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test("should initially render five tweets",()=>{
    const component = render(<TweetListComponent tweets={mockTweets} loading={RequestStatus.SUCCESSFULL}/>)
    expect(component.getAllByText("Joe Portman")).toHaveLength(5);
  })

    test("should dispatch fetchTweets on render",()=>{
    const component = render(<TweetListComponent tweets={mockTweets} loading={RequestStatus.SUCCESSFULL}/>)
    expect(fetchUserTweets).toHaveBeenCalledTimes(1);
    expect(fetchUserTweets).toHaveBeenCalledWith('jsmith');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  })
  test("should display no tweets on Empty Tweet List",()=>{
    const component = render(<TweetListComponent tweets={[]} loading={RequestStatus.SUCCESSFULL}/>)
    expect(component.queryByTestId("tweet-content")).toBeNull();

    expect(fetchUserTweets).toHaveBeenCalledTimes(1);
    expect(fetchUserTweets).toHaveBeenCalledWith('jsmith');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("should show loader on pending status passed",()=>{
    const component = render(<TweetListComponent tweets={[]} loading={RequestStatus.PENDING}/>)
    const refreshControl = component.getByTestId("flatlist").props.refreshControl;
    expect(refreshControl).toBeTruthy();
    expect(refreshControl.props.refreshing).toBe(true);
  });

  test("should trigger fetchTweets on refresh control and show next five items on onEndReached", ()=>{
    const component = render(<TweetListComponent tweets={mockTweets} loading={RequestStatus.SUCCESSFULL}/>);
    const flatList = component.getByTestId('flatlist');  
    const rc = flatList.props.refreshControl;
    act(() => rc.props.onRefresh());
    expect(fetchUserTweets).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(flatList.props.data.length).toBe(5);
    fireEvent(flatList, 'onEndReached');
    expect(flatList.props.data.length).toBe(7);

  });
});