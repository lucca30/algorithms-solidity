pragma solidity >=0.4.22 <0.9.0;

contract GCD {
    // function that only contract owner can run, to set a new message
    function euclidianAlgorithm(int256 a, int256 b) public returns (int256) {
        require(a >= b && b >= 0 && a > 0);
        // set new message
        if (b == 0) return a;
        return euclidianAlgorithm(b, a % b);
    }

    function verifyGcd(int256 a, int256 b, int256 gcd, int256 x, int256 y) public returns (int256) {
        require(a >= b && b >= 0 && a > 0, "Input not valid");
        
        // check correctnes
        require(gcd == x*a + y*b, "GCD not valid");

        return gcd;
    }
}
