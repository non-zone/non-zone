import abis from './abis';
import addresses from './addresses';
import { getSigner, ethers, getUserAddress } from '../contracts/wallet';
import { BigNumber } from 'ethers';


const storyFactoryContract = async () => {
  const signer = await getSigner();
  try {
    let contract = await new ethers.Contract(
      addresses.storyFactory,
      abis.storyFactory,
      signer
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

const interactionFactoryContract = async () => {
  try {
    const signer = await getSigner();
    let contract = await new ethers.Contract(
      addresses.interactionFactory,
      abis.interactionFactory,
      signer
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

const spaceTokenContract = async () => {
  try {
    const signer = await getSigner();
    let contract = await new ethers.Contract(
      addresses.spaceToken,
      abis.spaceToken,
      signer
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
}

export const createStory = async (
  props
) => {
  try {
    const storyFactoryInst = await storyFactoryContract();
    storyFactoryInst.once(
      'StoryCreated',
      async (tokenId, storyCreator, props) => {
        console.log('Token created!');
        console.log(tokenId.toString());
        console.log(props);
      },
    );
    let story = await storyFactoryInst.createStory(
      props
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
  props,
  storyTokenID
) => {
  try {
    const interactionInst = await interactionFactoryContract();
    interactionInst.once(
      'StoryInteractionCreated',
      async (tokenId, interactionCreator, props, storyTokenId, openStream) => {
        console.log('Story created!');
        console.log(tokenId.toString());
        console.log(openStream);
        console.log(props);
        console.log(storyTokenId);
      },
    );

    let interaction = await interactionInst.createStoryInteraction(
      props,
      1
    );
    return interaction;
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
}


export const numberOfStories = async () => {
  try {
    const storyFactoryInst = await storyFactoryContract();

    const numberOfStories = await storyFactoryInst.balanceOf(
      getUserAddress()
    );

    numberOfStories.toString();

    // return numberOfStories.toFixed();
    return Number(numberOfStories.toString());
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
}


export const spaceTokenBalance = async () => {
  try {
    const spaceTokenInst = await spaceTokenContract();
    const balance = await spaceTokenInst.balanceOf(
      getUserAddress()
    );
    let balanceStr = BigNumber.from(balance).toString();
    balanceStr = balanceStr.slice(0, balanceStr.length - 18);
    return Number(balanceStr);
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
}
export const payWithSpace = async (storiesCount) => {
  try {
    const spaceTokenInst = await spaceTokenContract();
    spaceTokenInst.once(
      'Transfer',
      async (sender, recipient, amount) => {
        console.log('Transfer completed!');
        console.log(sender.toString());
        console.log(recipient);
        console.log(amount);
      },
    );

    let transfered = await spaceTokenInst.transfer(
      '0x2CEF62C91Dd92FC35f008D1d6Ed08EADF64306bc',
      getTokenAmount(storiesCount)
    );
    console.log(transfered);
    return story;
  } catch (err) {
    console.log('error');
    console.log(err);
    return false;
  }
}

export const getStoryCreationPrice = (storiesCount) => {
  switch (storiesCount) {
    case 2:
      return 4.5;
    case 3:
      return 7;
    case 4:
      return 9;
    case 5:
      return 10.5;
    case 6:
      return 11.5;
    case 7:
      return 13;
    case 8:
      return 13.5;
    case 9:
      return 14.5;
    case 10:
      return 15;
    case 11:
      return 15.5;
    case 12:
      return 16;
    case 13:
      return 17;
    case 14:
      return 17.5;
    case 15:
      return 18;
    case 16:
      return 18;
    default:
      throw Error("You can't create more than 16 stories during our beta!");

  }
}