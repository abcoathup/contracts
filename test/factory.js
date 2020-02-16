import { waffle } from '@nomiclabs/buidler';
import chai from 'chai';
import { deployContract, solidity } from 'ethereum-waffle';
import Web3 from 'web3';

import RoundArtifact from '../build/contracts/FundingRound.json';
import FactoryArtifact from '../build/contracts/FundingRoundFactory.json';
import TokenArtifact from '../build/contracts/AnyOldERC20Token.json';

chai.use(solidity);
const { expect } = chai;

describe('Funding Round Factory', () => {
  const provider = waffle.provider;
  const web3 = new Web3(provider);

  const [dontUseMe, deployer, coordinator, contributor] = provider.getWallets();

  let factory;
  let token;
  let tokenContractAsContributor;

  beforeEach(async () => {
    factory = await deployContract(deployer, FactoryArtifact, [
      coordinator.address
    ]);

    expect(factory.address).to.properAddress;

    const initialSupply = '10000000000';

    token = await deployContract(deployer, TokenArtifact, [initialSupply]);

    expect(token.address).to.properAddress;

    // Get a reference to the token contract where msg.sender
    // is the contributor when it interacts with that contract
    tokenContractAsContributor = token.connect(contributor);

    const contractImApproving = await factory.currentRound();
    console.log({ contractImApproving });
    const amountToApprove = '100000';

    // Send this tx as the contributor
    await tokenContractAsContributor.approve(
      contractImApproving,
      amountToApprove
    );
    console.log('Approved');
  });

  it('has new round running', async () => {
    expect(await factory.currentRound()).to.properAddress;
  });

  it('set contract owner/witness/coordinator/round duration correctly', async () => {
    expect(await factory.coordinator()).to.eq(coordinator.address);
  });

  it('allows user to contribute to current round', async () => {
    const round = await new web3.eth.Contract(
      RoundArtifact.abi,
      await factory.currentRound()
    );
    // await round.contribute();
  });

  it('allows endRound to be called after round duration', async () => {});

  // it('allows endRound to be called if new coordinator is set', async () => {});

  // it('reverts if endRound is called and round not over or not newCoordinator', async () => {});

  it('deploys new round and sets newRound to updated address when endRound is called', async () => {});

  it('allows only witnesses to call setMaci', async () => {});

  it('set MACI address correctly, and newMaci == true', async () => {});

  // it('reverts if nextRound is called and newMaci != true', async () => {});

  // it('reverts if nextRound is called and coordinator == null', async () => {});

  // TODO: sendFundsToCurrentRound deprecated for `contribute`
  // it('moves funds to current funding round when calling sendFundsToCurrentRound in previous round', async () => {});

  // it('moves funds to current funding round when calling sendFundsToCurrentRound in current round', async () => {});

  it('moves DAI balance of factory to current funding round when calling nextRound', async () => {});

  it('sets currentRound and newMaci correctly when nextRound is called', async () => {});

  // it('allows only the owner to call nextRound', async () => {});

  // it('allows only the owner to set a new coordinator', async () => {});

  // it('ends the round when setCoordinator is called', async () => {});

  // it('allows only the coordinator to call coordinatorQuit and sets coordinator to null', async () => {});

  // it('allows only the witness to call witnessQuit and sets witness to null and newMaci to false', async () => {});

  // it('allows only the owner to call setOwner and sets new owner', async () => {});

  // it('allows only the owner to call setWitness and sets new witness', async () => {});

  // it('allows only the owner to call setRoundDuration and sets new round duration', async () => {});

  it('allows any user to trigger a claim for themselves or others after a round is completed', async () => {
    // recipient receives contributions
    // recipient receives expected contribution amount
  });

  // it('checks that a MACI is valid when donations occur after round duration', async () => {});
});
