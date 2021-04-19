import storyFactory from './abis/StoryFactory.json';
import interactionFactory from './abis/StoryInteractionFactory.json';
import spaceToken from './abis/SpaceToken.json';

const abis = {
  storyFactory: storyFactory.abi,
  interactionFactory: interactionFactory.abi,
  spaceToken: spaceToken.abi,
};

export default abis;
