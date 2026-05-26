// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeSignRegistry is Ownable {
    struct ContractLabel {
        string name;
        uint8 riskLevel;
        bool verifiedBySafeSign;
    }

    mapping(address => ContractLabel) private labels;

    event LabelUpdated(
        address indexed contractAddress,
        string name,
        uint8 riskLevel,
        bool verifiedBySafeSign
    );

    constructor() Ownable() {}

    function setLabel(
        address contractAddress,
        string calldata name,
        uint8 riskLevel,
        bool verifiedBySafeSign
    ) external onlyOwner {
        labels[contractAddress] = ContractLabel({
            name: name,
            riskLevel: riskLevel,
            verifiedBySafeSign: verifiedBySafeSign
        });
        emit LabelUpdated(contractAddress, name, riskLevel, verifiedBySafeSign);
    }

    function getLabel(address contractAddress) external view returns (ContractLabel memory) {
        return labels[contractAddress];
    }
}
