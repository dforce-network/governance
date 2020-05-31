import { get } from './http';
import fakeData from './fake';

export async function getVoteList(params) {
  return get('/votes', params);
}

export async function getVoteDetail(voteId) {
  // return get(`/votes/${voteId}`);
  return fakeData;
}
