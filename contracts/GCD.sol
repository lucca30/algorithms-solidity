pragma solidity >=0.4.22 <0.9.0;

contract GCD {
    // Algoritmo Euclidiano
    function Soluciona(int256 a, int256 b) public returns (int256, uint256, uint256) {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        int256 resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = algoritmoEuclidiano(a, b);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function algoritmoEuclidiano(int256 a, int256 b) pure private returns ( int256) {
        require(a >= b && b >= 0 && a > 0);
        int256 _a = a;
        int256 _b = b;
        int256 temp;
        while (_b > 0) {
            temp = _b;
            _b = _a % _b; 
            _a = temp;
        }
        return _a;
    }

    // vamos tentar incluir o certificado no preco

    // Algoritmo verificador
    function Verifica(int256 a, int256 b, int256 gcd, int256 x, int256 y) public returns (int256,uint256,uint256) {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        int256 resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = verificaGCD(a, b, gcd, x, y);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function verificaGCD(int256 a, int256 b, int256 gcd, int256 x, int256 y) private pure returns (int256) {
        require(a >= b && b >= 0 && a > 0, "Input not valid");
        
        // check correctnes
        require(gcd == x*a + y*b, "GCD not valid");

        return gcd;
    }


}
