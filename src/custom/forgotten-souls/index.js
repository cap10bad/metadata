import axios from "axios";

const rank = {
  Head: 9,
  Body: 8,
  Familiar: 7,
  Prop: 6,
  Rune: 5,
  Background: 4,
  Affinity: 3,
  Undesirable: 2,
};

export const fetchToken = async (_chainId, { contract, tokenId }) => {
  return axios
    .get(`https://portal.forgottenrunes.com/api/souls/data/${tokenId}`)
    .then((response) => {
      const attributes = response.data.attributes.reduce((result, trait) => {
        const traitType =
          trait.trait_type.charAt(0).toUpperCase() + trait.trait_type.slice(1);
        result.push({
          key: traitType,
          rank: rank[traitType] ? rank[traitType] : null,
          value: trait.value,
          kind: "string",
        });
        return result;
      }, []);

      return {
        contract,
        tokenId,
        name: response.data.name,
        imageUrl: response.data.image,
        attributes,
      };
    });
};

export const fetchContractTokens = (_chainId, contract, continuation) => {
  const pageSize = 1000;
  const tokenIdRange = [0, 9999];

  const minTokenId = continuation
    ? Math.max(continuation, tokenIdRange[0])
    : tokenIdRange[0];
  const maxTokenId = continuation
    ? Math.min(continuation + pageSize, tokenIdRange[1])
    : tokenIdRange[1];

  const assets = [];
  for (let tokenId = minTokenId; tokenId <= maxTokenId; tokenId++) {
    assets.push(fetchToken(_chainId, { contract, tokenId }));
  }

  return {
    continuation: maxTokenId === tokenIdRange[1] ? undefined : maxTokenId + 1,
    metadata,
  };
};
