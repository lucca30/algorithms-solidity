pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract MerkleTree {
    bytes32 claimMerkleRoot;
    address owner;

    constructor(){
        owner = msg.sender;
    }


    function DefineNovaRoot(bytes32 newRoot) public{
        claimMerkleRoot = newRoot;
    }

    // Algoritmo verificador
    function Verifica(address addressToCheck, bytes32[] calldata merkleProof) public returns (address,uint256,uint256) {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        address resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = verificaMerkle(addressToCheck, merkleProof);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function verificaMerkle(address addressToCheck, bytes32[] calldata merkleProof) private view returns (address) {
        require(MerkleProof.verify(merkleProof, claimMerkleRoot, keccak256(abi.encodePacked(addressToCheck))), "Not in list");

        return addressToCheck;
    }


}
