pragma solidity >=0.4.22 <0.9.0;

contract GCD {
    function euclidianAlgorithm(int256 a, int256 b) public returns (int256) {
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

    function verifyGcd(int256 a, int256 b, int256 gcd, int256 x, int256 y) public returns (int256) {
        require(a >= b && b >= 0 && a > 0, "Input not valid");
        
        // check correctnes
        require(gcd == x*a + y*b, "GCD not valid");

        return gcd;
    }
}
