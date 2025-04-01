const fetch = require('node-fetch')
const fs = require('fs')

const raw = fs.readFileSync('alias.json', 'utf-8')
const data = JSON.parse(raw)

const apiRaw = fs.readFileSync('api.json', 'utf-8')
const apiData = JSON.parse(apiRaw)

const checkCol = async (slug, address) => {
    const url = `https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?collectionSymbol=${slug}&ownerAddress=${address}&showAll=true&sortBy=priceAsc`;
    const headers = {
        "accept": "application/json",
        "x-api-key": "f0bbf46a6f6dcc414bda9759da67c648"
    }
    const res = await fetch(url, { method: "GET", headers: headers })
    const resp = await res.json()
    console.log(resp);
}

const checkAvailableEthTokens = async (owner, slug) => {
    const url = `https://api.opensea.io/api/v2/chain/ethereum/account/${owner}/nfts?collection=${slug}`
    const headers = {
        "accept": "application/json",
        "x-api-key": "32793035a5f04e4dadf50cd8fe048f3a"
    }
    const response = await fetch(url, { method: "GET", headers: headers })
    const resp = await response.json()
    const nfts = resp.nfts
    if (nfts && nfts.length > 0) {
        // console.log(nfts);
        console.log("Found NFTs")
        let nftList = []
        for (const nft of nfts) {
            nftList.push(
                {
                    name: nft.identifier,
                    image: nft.opensea_url
                }
            )
        }
        console.log(nftList);
        return nftList
    }
}

const checkAvailableAliasEthTokens = async (owner, slug) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].includes(slug)) {
            let apiIndex = 0
            let bigNFTList = []
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] !== slug) {
                    if (apiIndex >= apiData.length) {
                        apiIndex = 0;
                    }
                    let api = apiData[apiIndex]
                    const url = `https://api.opensea.io/api/v2/chain/ethereum/account/${owner}/nfts?collection=${data[i][j]}`
                    const headers = {
                        "accept": "application/json",
                        "x-api-key": api
                    }
                    const response = await fetch(url, { method: "GET", headers: headers })
                    const resp = await response.json()
                    const nfts = resp.nfts
                    if (nfts && nfts.length > 0) {
                        // console.log(nfts);
                        console.log("Found NFTs")
                        let nftList = []
                        for (const nft of nfts) {
                            bigNFTList.push(
                                {
                                    alias: data[i][j],
                                    name: nft.identifier,
                                    link: nft.opensea_url
                                }
                            )
                        }
                    }
                    apiIndex += 1;
                }
            }
            console.log(bigNFTList);
            return
        }
    }
}

// checkAvailableEthTokens("0x2B55931C76A3a302aAF7c25403606A154Af51FBA", "lilpudgys")

const checkAvailableSolTokens = async (owner, slug) => {
    const url = `https://api-mainnet.magiceden.dev/v2/wallets/${owner}/tokens?collection_symbol=${slug}`
    const headers = {
        "accept": "application/json",
    }
    const response = await fetch(url, { method: "GET", headers: headers })
    const resp = await response.json()
    console.log(resp[0]);
    const nfts = resp
    if (nfts && nfts.length > 0) {
        // console.log(nfts);
        console.log("Found NFTs")
        let nftList = []
        for (const nft of nfts) {
            nftList.push(
                {
                    name: nft.name,
                    link: `https://magiceden.io/item-details/${nft.mintAddress}`,
                    image: nft.image
                }
            )
        }
        console.log(nftList);
        return nftList
    }
}

// checkAvailableSolTokens("7fLdr55z38V5pHPDqqDNndip31xH4bNTDe5guv4Y5ynq", "degods")

checkAvailableAliasEthTokens("0xDFaB977372A039e78839687b8c359465f0f17532", "boredapeyachtclub")