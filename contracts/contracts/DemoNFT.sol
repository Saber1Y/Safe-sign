// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("DemoNFT", "DNFT") Ownable() {
        _nextTokenId = 1;
    }

    function mint() external returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId += 1;
        _safeMint(msg.sender, tokenId);
    }
}
