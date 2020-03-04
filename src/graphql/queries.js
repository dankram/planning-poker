/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = `query GetRoom($id: ID!) {
  getRoom(id: $id) {
    id
    flipped
    votes {
      name
      vote
    }
    storyLink
  }
}
`;
