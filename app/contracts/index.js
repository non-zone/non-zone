import abis from './abis';
import addresses from './addresses';
import { signer, ethers } from '../contracts/wallet';


const storyFactoryContract = async () => {
  try {
    let contract = await new ethers.Contract(
      addresses.storyFactory,
      abis.storyFactory,
      signer
    );
    console.log('contract')
    console.log(contract)
    return contract;
  } catch (err) {
    console.log(err);
  }
};

export const interactionFactoryContract = async () => {
  try {
    let contract = await new ethers.Contract(
      addresses.interactionFactory,
      abis.interactionFactory,
      signer
    );
    console.log('contract')
    console.log(contract)
    return contract;
  } catch (err) {
    console.log(err);
  }
};

export const createStory = async (
  owner,
  props,
  isMemory
) => {
  try {
    const storyFactoryInst = await storyFactoryContract();

    console.log(owner);
    storyFactoryInst.once(
      'StoryCreated',
      async (tokenId, storyCreator, props) => {
        console.log('Token created!');
        console.log(tokenId.toString());
        console.log(props);
      },
    );

    let estimateGas = await storyFactoryInst.estimateGas.createStory(
      owner,
      props,
      isMemory
    );

    console.log(estimateGas);
    console.log('gas estimate:' + estimateGas.toString() + ' GWEI');

    let story = await storyFactoryInst.createStory(
      owner,
      props,
      isMemory
    );
    console.log('contracts ticket');
    console.log(story);
    return story;
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
};

export const createInteraction = async (
  address,
  props,
  storyTokenID
) => {
  try {
    const interactionInst = await interactionFactoryContract();
    interactionInst.once(
      'StoryInteractionCreated',
      async (tokenId, storyCreator, props) => {
        console.log('Story created!');
        console.log(tokenId.toString());
        console.log(props);
      },
    );

      let estimateGas = await interactionInst.estimateGas.createInteraction(
        // address,
        props,
        storyTokenID
      );

      console.log(estimateGas);
      console.log('gas estimate:' + estimateGas.toString() + ' GWEI');

    let interaction = await interactionInst.createInteraction(
      // address,
      props,
      storyTokenID
    );
    console.log(interaction);
    return interaction;
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
}