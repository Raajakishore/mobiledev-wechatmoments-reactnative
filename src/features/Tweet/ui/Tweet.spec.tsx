import React from 'react';
import { render } from '@testing-library/react-native';
import {Tweet} from './Tweet';
import {ITweet} from '../../../types';

describe('Tweet', () => {
  const testTweet: ITweet = {
    sender: {
      nick: 'john',
      username: 'John Smith',
      avatar: 'test-image.url',
    },
    content: 'tweet content',
    images: [{url: 'image1.url'}, {url: 'image2.url'}],
  };
  
  test("should render the component ", ()=>{
    const component = render(<Tweet tweet = {testTweet} />);
    expect(component.getByTestId("tweet-wrapper")).toBeTruthy();
  });

  test("should render the avatar ", ()=>{
    const component = render(<Tweet tweet = {testTweet} />);
    expect(component.getByTestId("tweet-avatar")).toBeTruthy();
  });

  test("should render the tweet content ", ()=>{
    const component = render(<Tweet tweet = {testTweet} />);
    expect(component.getByText("tweet content"));
  });

    test("should render all tweet images  ", ()=>{
    const component = render(<Tweet tweet = {testTweet} />);
    expect(component.getAllByTestId("tweet-image")).toHaveLength(2);
  });


});
