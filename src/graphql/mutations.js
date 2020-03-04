/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addVote = `mutation AddVote($id: ID!, $name: String!, $vote: Int!) {
  addVote(id: $id, name: $name, vote: $vote) {
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
export const createRoom = `mutation CreateRoom(
  $input: CreatePokerRoomInput!
  $condition: ModelPokerRoomConditionInput
) {
  createRoom(input: $input, condition: $condition) {
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
export const updateRoom = `mutation UpdateRoom(
  $input: UpdatePokerRoomInput!
  $condition: ModelPokerRoomConditionInput
) {
  updateRoom(input: $input, condition: $condition) {
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
