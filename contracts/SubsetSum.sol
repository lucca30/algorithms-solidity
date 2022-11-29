pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SubsetSum {
    constructor() {
    }

    function SolucionaRecursivo(uint256[] calldata set, uint256 sum)
        public
        returns (
            bool,
            uint256,
            uint256
        )
    {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        bool resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = solucionaRecursivo(set, set.length ,sum);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function solucionaRecursivo(uint256[] calldata set, uint256 n, uint256 sum) private returns (bool)
    {
        if (sum == 0) return true;
        if (n == 0) return false;

        //Se ultrapassar a soma, ignora
        if (set[n - 1] > sum)
            return solucionaRecursivo(set, n - 1, sum);

        // Recursão utilizando ou não o item
        return solucionaRecursivo(set, n - 1, sum)
            || solucionaRecursivo(set, n - 1, sum - set[n - 1]);
    }


    function SolucionaDP(uint256[] calldata set, uint256 sum)
        public
        returns (
            bool,
            uint256,
            uint256
        )
    {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        bool resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = solucionaDP(set, set.length ,sum);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function solucionaDP(uint256[] calldata set, uint256 n, uint256 sum) private returns (bool)
    {
        bool[][] memory subset = new bool[][](sum+1);
        for (uint256 i = 0; i < sum + 1; i++) {
            subset[i] = new bool[](n+1);
        }

        for (uint256 i = 0; i <= n; i++)
            subset[0][i] = true;

        for (uint256 i = 1; i <= sum; i++)
            subset[i][0] = false;

        for (uint256 i = 1; i <= sum; i++) {
            for (uint256 j = 1; j <= n; j++) {
            subset[i][j] = subset[i][j - 1];
            if (i >= set[j - 1])
                subset[i][j] = subset[i][j]
                || subset[i - set[j - 1]][j - 1];
            }
        }

        return subset[sum][n];
    }


    function SolucionaMemoizacao(uint256[] calldata set, uint256 sum)
        public
        returns (
            bool,
            uint256,
            uint256
        )
    {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        uint256 resultado;
        uint256 gasAntesDaFuncao = gasleft();
        uint256[][] memory subset;
        resultado = solucionaMemoizacao(set, set.length ,sum, true, subset);
        bool solucao = resultado == 1;
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (solucao, gasUsado, consumoInicial);
    }

    function solucionaMemoizacao(uint256[] calldata set, uint256 n, uint256 sum, bool isFirstCall, uint256[][] memory subset) private returns (uint256)
    {
        if(isFirstCall){
            subset = new uint256[][](n+1);
            for (uint256 i = 0; i < n+1; i++) {
                subset[i] = new uint256[](sum+1);
                for (uint256 j = 0; j < sum+1; j++) {
                    subset[i][j] = 2;
                }
            }
        }
            

        if (sum == 0)
            return 1;

        if (n == 0)
            return 0;
        

        if (subset[n - 1][sum] != 2)
            return subset[n - 1][sum];

        if (set[n - 1] > sum){
            subset[n - 1][sum] = solucionaMemoizacao(set, n - 1, sum, false, subset);
            return subset[n - 1][sum];
        }
        else {
            subset[n - 1][sum] = solucionaMemoizacao(set, n - 1, sum, false, subset) |
                solucionaMemoizacao(set, n - 1, sum - set[n - 1], false, subset);
            return subset[n - 1][sum];
        }
    }


    function Verifica(uint256[] calldata set, uint256 sum, uint256[] calldata certificado)
        public
        returns (
            bool,
            uint256,
            uint256
        )
    {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        bool resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = verifica(set,sum, certificado);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function verifica(uint256[] calldata set, uint256 sum, uint256[] calldata certificado)
        private returns (bool)
    {
        uint256 tempSum = 0;
        uint256 j = 0;
        for(uint256 i=0;i<certificado.length;i++){
            bool elementExistsInSet = false;
            while(j < set.length){
                if(certificado[i] == set[j]){
                    j++;
                    elementExistsInSet = true;
                    tempSum += certificado[i];
                    break;
                }
                j++;
            }
            if(!elementExistsInSet) return false;
        }
        return tempSum == sum;
    }

}
