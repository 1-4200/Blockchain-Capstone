pragma solidity >=0.4.21 <0.6.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

contract SolnSquareVerifier is ERC721MintableComplete {
    using SafeMath for uint256;

    Verifier public verifier;

    struct solution {
        uint256 index;
        address sender;
    }

    solution[] private solutions;
    mapping(bytes32 => solution) private submittedSolutions;
    uint256 indexCounter = 0;

    event SolutionAdded(bytes32 key, uint256 index, address sender);

    constructor(address _verifierAddress, string memory _name, string memory _symbol) ERC721MintableComplete(_name, _symbol) public {
        verifier = Verifier(_verifierAddress);
    }

    function addSolution(uint[2] memory _a, uint[2][2] memory _b, uint[2] memory _c, uint[2] memory _input) public {
        bytes32 key = keccak256(abi.encodePacked(_a, _b, _c, _input));
        require(submittedSolutions[key].index == 0, "require unique solution");
        require(submittedSolutions[key].sender != address(0), "require unique solution");
        solution memory newSolution = solution({index : indexCounter, sender : msg.sender});
        submittedSolutions[key] = newSolution;
        solutions.push(newSolution);
        emit SolutionAdded(key, indexCounter, msg.sender);
        indexCounter.add(1);
    }

    function mintNFT(address _to, uint256 _tokenId, uint[2] memory _a, uint[2][2] memory _b, uint[2] memory _c, uint[2] memory _input) public {
        require(verifier.verifyTx(_a, _b, _c, _input), "not verified");
        addSolution(_a, _b, _c, _input);
        super._mint(_to, _tokenId);
    }
}

  


























